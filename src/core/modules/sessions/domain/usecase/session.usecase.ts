import { Injectable } from '@nestjs/common';
import { Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import dayjs from 'dayjs';
import { instanceToPlain } from 'class-transformer';
import { SessionRepository } from '../../data/session.repository';
import { Session, TLoginSession } from '../entities/session.entity';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '@/core/base/domain/usecase/base.usecase';
import {
  TCompactAuthUser,
  TUsersRoles,
} from '@/core/base/domain/entities/auth.entity';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import {
  InvalidRefreshToken,
  RefreshTokenExpired,
  RefreshTokenNotFound,
  UserNotFound,
  WrongPassword,
} from '@/core/modules/sessions/domain/entities/session.exception';
import { generateJwt } from '@/core/base/frameworks/shared/utils/jwt.util';
import { checkPassword } from '@/core/base/frameworks/shared/utils/password.util';
import { UserRepository } from '@/modules/users/data/user.repository';
import { Prisma } from '@prisma/client';
import { UserFull } from '@/modules/users/domain/entities/user.entity';

@Injectable()
export class SessionUseCase extends BaseUseCase<
  Session,
  Prisma.SessionInclude,
  Prisma.SessionSelect,
  Prisma.SessionWhereInput | Prisma.SessionWhereUniqueInput,
  Prisma.XOR<Prisma.SessionCreateInput, Prisma.SessionUncheckedCreateInput>,
  Prisma.SessionCreateManyInput[] | Prisma.SessionCreateManyInput,
  Prisma.XOR<Prisma.SessionUpdateInput, Prisma.SessionUncheckedUpdateInput>
> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    db: PrismaService,
  ) {
    super(sessionRepository, db);
    this.userRepository = userRepository;
  }

  /**
   * ## convertToCompactAuthUser
   * Since we have complex user, role groups, roles, permissions. we need to generate AuthData
   * which will be used for authentication and authorization. we will simplfy two data which is
   * roles and permissions.
   * @param user UserFull
   * @returns TCompactAuthUser
   */
  private convertToCompactAuthUser(user: UserFull): TCompactAuthUser {
    const permissions = this.generateUniquePermissions({
      roles: user.roles,
    });

    const parsedUser: TCompactAuthUser = {
      id: user.id,
      name: user.name,
      description: user.description,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      permissions,
      roles: user.roles.map((userRole) => userRole.role.name),
      siteCode: user.site.code,
      siteId: user.site.id,
    };

    return parsedUser;
  }

  /**
   * ## generateUniquePermissions
   * This is to generate Unique Permissions
   * @param ({ roles }) TUsersRoles
   * @returns string[]
   */
  private generateUniquePermissions = ({ roles }: TUsersRoles): string[] => {
    return Array.from(
      new Set([
        ...roles.reduce(
          (acc, userRole) => [
            ...acc,
            ...userRole.role.permissions.map(
              (rolePermission) => rolePermission.permission.alias,
            ),
          ],
          [] as string[],
        ),
      ]),
    );
  };

  @Span('usecase session logout')
  async logout(userId: string): Promise<void> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.sessionRepository.deleteByUserId(userId, tx);
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected when try to logout!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase refresh token')
  async refreshToken(ctx: IContext): Promise<Session> {
    // Check whether the refresh token exists!
    const refreshToken = ctx.refreshToken;

    // If not exists, then throw an error
    if (refreshToken === undefined) throw new RefreshTokenNotFound();

    // Get current session user from the context
    const user = ctx.user as TCompactAuthUser;
    const headers = Object.assign({}, ctx.headers);

    // delete unused headers
    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    try {
      return await this.db.$transaction(async (tx) => {
        // Check whether current session is still exist, find by refresh token!
        const currentSession = await this.sessionRepository.findByRefreshToken(
          refreshToken,
          tx,
        );

        // If current session is not found, then throw an error InvalidRefreshToken
        if (!currentSession) {
          throw new InvalidRefreshToken();
        }

        // Check the expiration of Refresh Token
        if (dayjs().isAfter(currentSession.expiredAt)) {
          throw new RefreshTokenExpired({
            expiredAt: dayjs(currentSession.expiredAt).format(),
          });
        }

        // Regenerate JWT Token
        const jwt = await generateJwt({
          origin: ctx.headers?.['origin'] || 'http://localhost',
          userId: currentSession.userId,
          user,
        });

        // Update the current session by refresh token, to update the token
        const session = await this.sessionRepository.updateByRefreshToken(
          {
            data: { user: instanceToPlain(user), headers },
            expiredAt: jwt.expired,
            userId: currentSession.userId,
            token: jwt.token,
            refresh: jwt.refresh,
          },
          refreshToken,
          tx,
        );

        return session;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected when try to refresh the token!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase session login')
  async login(ctx: IContext, body: TLoginSession): Promise<Session> {
    const headers = Object.assign({}, ctx.headers);

    // delete unused headers
    delete headers['authorization'];
    delete headers['content-type'];
    delete headers['content-length'];

    try {
      return await this.db.$transaction(async (tx) => {
        // get the full of user from user repository
        const user = await this.userRepository.getFullByName(body.username, tx);

        // Check whether user exists!. If not throw an error NotFound
        if (!user) {
          throw new UserNotFound({ username: body.username });
        }

        // Check whether the password is match with the database
        const isMatch = await checkPassword(body.password, user.password);

        // If not match throw an Error WrongPassword!
        if (!isMatch) {
          throw new WrongPassword();
        }

        // Simplify the user data!
        const customUser = this.convertToCompactAuthUser(user);

        // Generate JWT Token!
        const jwt = await generateJwt({
          origin: ctx.headers?.['origin'] || 'http://localhost',
          user: customUser,
          userId: user.id,
        });

        // Store session data into database!
        const session = await this.repository.create(
          {
            data: { user: instanceToPlain(customUser), headers },
            user: {
              connect: {
                id: user.id,
              },
            },
            token: jwt.token,
            refresh: jwt.refresh,
            expiredAt: jwt.expired,
          },
          tx,
        );

        return session;
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected when try to login!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
