import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User, UserFull } from '../domain/entities/user.entity';
import { BaseRepository } from '@/core/base/data/base.repository';
import { TPrismaTx } from '@/core/base/domain/entities';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  Prisma.UserInclude,
  Prisma.UserSelect,
  Prisma.UserWhereInput | Prisma.UserWhereUniqueInput,
  Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  Prisma.UserCreateManyInput[] | Prisma.UserCreateManyInput,
  Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
> {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(User, cacheManager);
    this.defaultInclude = {
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
  }

  async getFullByName(
    username: string,
    tx: TPrismaTx,
  ): Promise<UserFull | null> {
    const user = await tx.user.findUnique({
      where: {
        name: username,
      },
      include: {
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
      },
    });

    return user as UserFull;
  }

  async getFullById(id: string, tx: TPrismaTx): Promise<UserFull | null> {
    const user = await tx.user.findUnique({
      where: {
        id: id,
      },
      include: {
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
      },
    });

    return user as UserFull;
  }
}
