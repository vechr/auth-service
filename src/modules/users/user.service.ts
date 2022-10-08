import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import userException from './user.exception';
import { GetUserParamsValidator } from './validators/get-user.validator';
import PrismaService from '@/prisma/prisma.service';
import { TUserFullInformation } from '@/shared/types/user.type';

@Injectable()
export default class UserService {
  constructor(private readonly db: PrismaService) {}

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
