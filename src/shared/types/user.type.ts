import {
  Permission,
  Role,
  RolesPermissions,
  Site,
  User,
  UsersRoles,
} from '@prisma/client';

export type TUserCustomInformation = Partial<User> & {
  siteCode: string;
  roles: string[];
  permissions: string[];
};

export type TUserFullInformation = User &
  TUsersRoles & {
    site: Site;
  };

export type TUsersRoles = {
  roles: (UsersRoles & {
    role: Role & {
      permissions: (RolesPermissions & { permission: Permission })[];
    };
  })[];
};
