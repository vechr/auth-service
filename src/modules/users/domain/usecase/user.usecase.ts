import { Injectable } from '@nestjs/common';
import { OtelMethodCounter, Span, TraceService } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { UserRepository } from '../../data/user.repository';
import {
  TCreateUserRequestBody,
  TUpdateUserRequestBody,
  TUpsertUserRequestBody,
  User,
  UserFull,
} from '../entities/user.entity';
import {
  DeleteUnauthorized,
  DuplicateUser,
  PasswordIsNotMatch,
} from '@/modules/users/domain/entities/user.exception';
import { generatePassword } from '@/core/base/frameworks/shared/utils/password.util';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import { Prisma } from '@prisma/client';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';

@Injectable()
export class UserUseCase extends BaseUseCase<
  User,
  Prisma.UserInclude,
  Prisma.UserSelect,
  Prisma.UserWhereInput | Prisma.UserWhereUniqueInput,
  Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  Prisma.UserCreateManyInput[] | Prisma.UserCreateManyInput,
  Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
> {
  constructor(
    protected repository: UserRepository,
    db: PrismaService,
    traceService: TraceService,
  ) {
    super(repository, db, traceService);
  }

  @OtelMethodCounter()
  @Span('usecase create user')
  override async upsert(
    ctx: IContext,
    body: TUpsertUserRequestBody,
  ): Promise<User> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        const create: Prisma.UserCreateInput = {
          fullName: body.fullName,
          description: body.description,
          email: body.email,
          phoneNumber: body.phoneNumber,
          name: body.name,
          password: await generatePassword(body.password),
          site: {
            connect: { id: body.siteId },
          },
          roles: {
            create: body.roles.map((role) => ({
              role: { connect: { id: role } },
            })),
          },
        };

        const update: Prisma.UserUpdateInput = {
          fullName: body.fullName,
          description: body.description,
          email: body.email,
          phoneNumber: body.phoneNumber,
          name: body.name,
          password: await generatePassword(body.password),
          site: {
            connect: { id: body.siteId },
          },
          roles: {
            create: body.roles.map((role) => ({
              role: { connect: { id: role } },
            })),
          },
        };

        span?.addEvent('store the user data');
        return await this.repository.upsert(
          true,
          ctx,
          body.name,
          tx,
          create,
          update,
        );
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * This is overriding method
   * @param {TCreateUserRequestBody} body
   * @returns {Promise<User>}
   */
  @OtelMethodCounter()
  @Span('usecase create user')
  override async create(
    ctx: IContext,
    body: TCreateUserRequestBody,
  ): Promise<User> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('call repository get full user by name');
        const getUser = await this.repository.getFullByName(body.name, tx);

        if (getUser) {
          throw new DuplicateUser({
            username: body.name,
          });
        }

        if (body.password !== body.confirmPassword) {
          throw new PasswordIsNotMatch({
            message: 'Failed create user!',
          });
        }

        const bodyModified: Prisma.UserCreateInput = {
          fullName: body.fullName,
          description: body.description,
          email: body.email,
          phoneNumber: body.phoneNumber,
          name: body.name,
          password: await generatePassword(body.password),
          site: {
            connect: { id: body.siteId },
          },
          roles: {
            create: body.roles.map((role) => ({
              role: { connect: { id: role } },
            })),
          },
        };

        span?.addEvent('store the user data');
        return await this.repository.create(true, ctx, bodyModified, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * This is overriding method
   * @param {TUpdateUserByIdRequestParams} params
   * @param {TUpdateUserRequestBody} body
   * @returns {Promise<User>}
   */
  @OtelMethodCounter()
  @Span('usecase update user')
  override async update(
    ctx: IContext,
    id: string,
    body: TUpdateUserRequestBody,
  ): Promise<User> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('call repository get user by id');
        await this.repository.getById(id, tx);

        if (body.password !== body.confirmPassword) {
          throw new PasswordIsNotMatch({
            message: 'Failed update the user!',
          });
        }

        delete body.confirmPassword;
        if (body.password)
          body.password = await generatePassword(body.password);

        const bodyModified: Prisma.UserUpdateInput = {
          fullName: body.fullName,
          description: body.description,
          email: body.email,
          phoneNumber: body.phoneNumber,
          name: body.name,
          password: body.password,
          site: {
            connect: { id: body.siteId },
          },
          roles: {
            deleteMany: {},
            create: body.roles?.map((role) => ({
              role: { connect: { id: role } },
            })),
          },
        };

        span?.addEvent('store the user data');
        return await this.repository.update(true, ctx, id, bodyModified, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during change a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * @param { ids: string[] } body
   * @param {TCompactAuthUser} currentUser
   * @returns { count: number }
   */
  @OtelMethodCounter()
  @Span('usecase batch delete')
  async deleteBatchWithCurrentUserCheck(
    ctx: IContext,
    body: { ids: string[] },
  ): Promise<{ count: number }> {
    const span = this.traceService.getSpan();
    body.ids.forEach((id) => {
      if (ctx.user.id === id) {
        throw new DeleteUnauthorized({
          username: ctx.user.name,
        });
      }
    });

    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('delete the user data');
        return await this.repository.deleteBatch(body.ids, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete the datas!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  /**
   * Delete with check current user, we cannot delete our self
   * @param {TDeleteUserByIdRequestParams} params
   * @param {TCompactAuthUser} currentUser
   * @returns {Promise<User>}
   */
  @OtelMethodCounter()
  @Span('deleteWithCurrentUserCheck usecase')
  async deleteWithCurrentUserCheck(ctx: IContext, id: string): Promise<User> {
    const span = this.traceService.getSpan();
    if (ctx.user.id === id) {
      throw new DeleteUnauthorized({
        username: ctx.user.name,
      });
    }

    try {
      const result = await this.db.$transaction(async (tx) => {
        await this.repository.getById(id, tx);

        span?.addEvent('delete the user data');
        return await this.repository.delete(true, ctx, id, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      span?.end();
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('findCompleteById usecase')
  public async findCompleteById(id: string): Promise<UserFull | null> {
    const span = this.traceService.getSpan();

    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('get the user data full');
        return await this.repository.getFullById(id, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('findCompleteByUsername usecase')
  public async findCompleteByUsername(
    username: string,
  ): Promise<UserFull | null> {
    const span = this.traceService.getSpan();

    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('get the user by full name');
        return await this.repository.getFullByName(username, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete a user!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
