import { Prisma, User } from '@prisma/client';
import appConfig from '../../src/config/app.config';
import { generatePassword } from '../../src/core/base/frameworks/shared/utils/password.util';

type TUserSeed = {
  where: Partial<User>;
  update: Partial<Prisma.UserUpdateInput>;
  create: Partial<Prisma.UserCreateInput>;
}[];

const users = async (): Promise<TUserSeed> => [
  {
    where: { id: '9fc509dd-2cae-433e-b9ee-705d92c56d9c' },
    update: {
      id: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
      site: {
        connect: { code: appConfig.INITIAL_SITE.code },
      },
      fullName: appConfig.INITIAL_SUPERUSER.fullName,
      email: appConfig.INITIAL_SUPERUSER.email,
      phoneNumber: appConfig.INITIAL_SUPERUSER.phoneNumber,
      password: await generatePassword(appConfig.INITIAL_SUPERUSER.password || 'password'),
      name: appConfig.INITIAL_SUPERUSER.name,
      roles: {
        deleteMany: {},
        createMany: {
          data: {
            roleId: '5ae20ea0-4643-11ed-b878-0242ac120002',
          },
        },
      },
    },
    create: {
      id: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
      site: {
        connect: { code: appConfig.INITIAL_SITE.code },
      },
      fullName: appConfig.INITIAL_SUPERUSER.fullName,
      email: appConfig.INITIAL_SUPERUSER.email,
      phoneNumber: appConfig.INITIAL_SUPERUSER.phoneNumber,
      password: await generatePassword(appConfig.INITIAL_SUPERUSER.password || 'password'),
      name: appConfig.INITIAL_SUPERUSER.name,
      roles: {
        createMany: {
          data: {
            roleId: '5ae20ea0-4643-11ed-b878-0242ac120002',
          },
        },
      },
    },
  },
];

export default users();
