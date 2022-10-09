import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import userException from './user.exception';
import { GetUserParamsValidator } from './validators/get-user.validator';
import { TListUserRequestQuery } from './requests/list-user.request';
import PrismaService from '@/prisma/prisma.service';
import { TUserFullInformation } from '@/shared/types/user.type';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';

@Injectable()
export default class UserService {
  constructor(private readonly db: PrismaService) {}

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
    const includes = {
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
    };

    if (type === 'username') {
      const user = (await this.findByUsername(
        unique,
        includes,
      )) as TUserFullInformation;
      return user;
    }

    const user = (await this.findById(
      unique,
      includes,
    )) as TUserFullInformation;
    return user;
  }
}
