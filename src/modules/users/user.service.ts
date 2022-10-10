import { Injectable } from '@nestjs/common';
import { AuditAction, Prisma, User } from '@prisma/client';
import AuditAuthService from '../audits/audit.service';
import siteException from '../sites/site.exception';
import userException from './user.exception';
import { GetUserParamsValidator } from './validators/get-user.validator';
import { TListUserRequestQuery } from './requests/list-user.request';
import { CreateUserBodyValidator } from './validators/create-user.validator';
import {
  IUpdateUserRequestBody,
  IUpdateUserRequestParams,
} from './requests/update-user.request';
import PrismaService from '@/prisma/prisma.service';
import {
  TUserCustomInformation,
  TUserFullInformation,
} from '@/shared/types/user.type';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';
import { generatePassword } from '@/shared/utils/password.util';

@Injectable()
export default class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly auditAuth: AuditAuthService,
  ) {}

  public async list(ctx: IContext): Promise<{
    result: User[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListUserRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListUserRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, users] = await this.db.$transaction([
      this.db.user.count(selectOptions),
      this.db.user.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const meta = parseMeta<User>({
      result: users,
      total,
      page,
      limit,
    });

    return {
      result: users,
      meta,
    };
  }

  public async get(params: GetUserParamsValidator): Promise<User> {
    const user = await this.findCompleteById(params.id);

    if (!user) {
      throw new userException.UserNotFound({ id: params.id });
    }

    return user;
  }

  public async create(
    ctx: IContext,
    users: TUserCustomInformation,
    body: CreateUserBodyValidator,
  ): Promise<User> {
    const {
      fullName,
      username,
      description,
      emailAddress,
      phoneNumber,
      confirmPassword,
      password,
      roles,
    } = body;

    if (password !== confirmPassword) {
      throw new userException.PasswordIsNotMatch({
        message: 'Failed create User!',
      });
    }

    try {
      const user = await this.db.user.create({
        data: {
          emailAddress,
          fullName,
          username,
          description,
          password: await generatePassword(password),
          phoneNumber,
          site: {
            connect: { code: users.siteCode },
          },
          roles: {
            create: roles.map((role) => ({
              role: { connect: { id: role } },
            })),
          },
        },
        include: this.includes(),
      });

      const auditUser: Partial<User> = user;
      delete auditUser.password;

      this.auditAuth.sendAudit(ctx, AuditAction.CREATED, {
        id: user.id,
        incoming: auditUser,
        auditable: 'user',
      });

      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new userException.DuplicateUser({ username: username });
      }

      throw error;
    }
  }

  public async update(
    ctx: IContext,
    body: IUpdateUserRequestBody,
    params: IUpdateUserRequestParams,
  ): Promise<User> {
    if (body.password || body.confirmPassword) {
      if (body.password !== body.confirmPassword) {
        throw new userException.PasswordIsNotMatch({
          message: 'Failed create User!',
        });
      }
    }
    if (body.password !== undefined) {
      body = {
        ...body,
        ...{ password: await generatePassword(body.password) },
      };
    }

    delete body.confirmPassword;

    const checkUser = await this.db.user.findUnique({
      where: { id: params.id },
    });

    if (!checkUser) {
      throw new userException.UserNotFound({ id: params.id });
    }

    const site = await this.db.site.findUnique({
      where: {
        id: body.siteId,
      },
    });

    if (!site) {
      throw new siteException.SiteNotFound({ id: params.id });
    }

    const checkAuditUser: Partial<User> = checkUser;
    delete checkAuditUser.password;

    try {
      const user = await this.db.user.update({
        where: { id: params.id },
        data: {
          fullName: body.fullName,
          username: body.username,
          description: body.description,
          emailAddress: body.emailAddress,
          password: body.password,
          phoneNumber: body.phoneNumber,
          roles: {
            deleteMany: {},
            create: body.roles.map((role) => ({
              role: { connect: { id: role } },
            })),
          },
          site: {
            connect: { code: site.code },
          },
        },
        include: this.includes(),
      });

      const auditUser: Partial<User> = user;
      delete auditUser.password;

      this.auditAuth.sendAudit(ctx, AuditAction.UPDATED, {
        id: user.id,
        prev: checkAuditUser,
        incoming: auditUser,
        auditable: 'user',
      });

      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new userException.DuplicateUser({ username: checkUser.username });
      }

      throw error;
    }
  }

  public async delete(
    ctx: IContext,
    params: IUpdateUserRequestParams,
  ): Promise<User> {
    const currentUser = await this.db.user.findUnique({
      where: { id: params.id },
    });

    if (!currentUser) {
      throw new userException.UserNotFound({ id: params.id });
    }

    const user = await this.db.user.delete({
      where: { id: params.id },
    });

    const auditUser: Partial<User> = currentUser;
    delete auditUser.password;

    this.auditAuth.sendAudit(ctx, AuditAction.DELETED, {
      id: user.id,
      prev: auditUser,
      auditable: 'user',
    });

    return user;
  }

  public async findById(
    id: string,
    include?: Prisma.UserInclude,
  ): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        id,
      },
      include: include,
    });

    return user;
  }

  public async findCompleteById(id: string): Promise<TUserFullInformation> {
    const user = await this.findCompleteBy('id', id);

    return user;
  }

  public async findByUsername(
    username: string,
    include?: Prisma.UserInclude,
  ): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        username,
      },
      include: include,
    });

    return user;
  }

  public async findCompleteByUsername(
    username: string,
  ): Promise<TUserFullInformation> {
    const user = await this.findCompleteBy('username', username);

    return user;
  }

  private async findCompleteBy(type: 'username' | 'id', unique: string) {
    if (type === 'username') {
      const user = (await this.findByUsername(
        unique,
        this.includes(),
      )) as TUserFullInformation;
      return user;
    }

    const user = (await this.findById(
      unique,
      this.includes(),
    )) as TUserFullInformation;
    return user;
  }

  private includes = () => ({
    sessions: true,
    works: true,
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    },
    site: true,
  });
}
