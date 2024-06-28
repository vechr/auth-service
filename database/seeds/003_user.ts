import { Prisma, User } from '@prisma/client';
import appConstant from '../../src/config/app.config';
import { generatePassword } from '../../src/core/base/frameworks/shared/utils/password.util';

type TUserSeed = {
  where: Partial<User>;
  update: Partial<User>;
  create: Partial<Prisma.UserCreateInput>;
}[];

const users = async (): Promise<TUserSeed> => [
  {
    where: { username: appConstant.INITIAL_SUPERUSER.username },
    update: {},
    create: {
      id: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
      site: {
        connect: { code: appConstant.INITIAL_SITE.code },
      },
      fullName: appConstant.INITIAL_SUPERUSER.fullName,
      emailAddress: appConstant.INITIAL_SUPERUSER.emailAddress,
      phoneNumber: appConstant.INITIAL_SUPERUSER.phoneNumber,
      password: await generatePassword(
        appConstant.INITIAL_SUPERUSER.password || 'password',
      ),
      username: appConstant.INITIAL_SUPERUSER.username,
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
