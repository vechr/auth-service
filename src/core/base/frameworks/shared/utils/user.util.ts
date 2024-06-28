import { Session, Site } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import { TUserCustomInformation, TUserFullInformation, TUsersRoles } from '../types/user.type';

export const transformUserToCustomInformation = (
  user: TUserFullInformation,
): TUserCustomInformation => {
  const parsedUser = instanceToPlain(user) as TUserCustomInformation & {
    site?: Site;
    sessions?: Session[];
  };

  parsedUser.permissions = generateUniquePermission({
    roles: user.roles,
  });

  parsedUser.roles = user.roles.map((userRole) => userRole.roleId);
  parsedUser.siteCode = user.site.code;

  delete parsedUser.site;
  delete parsedUser.password;
  delete parsedUser.createdAt;
  delete parsedUser.updatedAt;

  delete parsedUser.sessions;

  return parsedUser;
};

export const generateUniquePermission = ({ roles }: TUsersRoles): string[] => {
  return Array.from(
    new Set([
      ...roles.reduce(
        (acc, userRole) => [
          ...acc,
          ...userRole.role.permissions.map((rolePermission) => rolePermission.permission.alias),
        ],
        [] as string[],
      ),
    ]),
  );
};
