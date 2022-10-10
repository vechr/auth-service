import { Permission, PermissionType } from '@prisma/client';

type TPermissionSeed = {
  where: Partial<Permission>;
  update: Partial<Permission>;
  create: Partial<Permission>;
}[];

const permissions: TPermissionSeed = [
  {
    where: { alias: 'root' },
    update: {},
    create: {
      id: 'd8beca16-5296-458a-bc8a-609d217fed08',
      alias: 'root',
      name: 'superuser',
      description: 'full access to the whole system',
      permissionType: PermissionType.Security,
    },
  },
  // users module
  {
    where: { alias: 'users:create@auth' },
    update: {},
    create: {
      id: '7d8d76c3-dd12-4716-b4b2-3a25f89966aa',
      alias: 'users:create@auth',
      name: 'create user',
      description: 'access to create new user',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'users:read@auth' },
    update: {},
    create: {
      id: '1afdbef2-39a5-4569-8be3-0fcc1ebc1219',
      alias: 'users:read@auth',
      name: 'read user',
      description: 'access to read user data',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'users:update@auth' },
    update: {},
    create: {
      id: '606479db-dfbe-4adb-a94d-c15ab654ccef',
      alias: 'users:update@auth',
      name: 'update specific user',
      description: 'access to update specific user data',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'users:delete@auth' },
    update: {},
    create: {
      id: 'b0dfa73c-7fbb-4bfa-bdd0-1849f6ebf198',
      alias: 'users:delete@auth',
      name: 'delete user',
      description: 'access to delete user',
      permissionType: PermissionType.Security,
    },
  },
  // roles module
  {
    where: { alias: 'roles:create@auth' },
    update: {},
    create: {
      id: '16943c13-0ff0-492d-a082-cec27864e3bd',
      alias: 'roles:create@auth',
      name: 'create roles',
      description: 'access to create new role',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'roles:read@auth' },
    update: {},
    create: {
      id: '9fa2361f-5441-451b-a613-e3d888d7b4a9',
      alias: 'roles:read@auth',
      name: 'read user',
      description: 'access to read role data',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'roles:update@auth' },
    update: {},
    create: {
      id: '26623b58-db0b-427f-8c4c-556dd2d78f99',
      alias: 'roles:update@auth',
      name: 'update specific user',
      description: 'access to update specific role data',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'roles:delete@auth' },
    update: {},
    create: {
      id: '6c80b595-90b9-4f3b-83b6-71c1dab3154d',
      alias: 'roles:delete@auth',
      name: 'delete user',
      description: 'access to delete role',
      permissionType: PermissionType.Security,
    },
  },
  // permissions module
  {
    where: { alias: 'permissions:read@auth' },
    update: {},
    create: {
      id: 'cf317b36-be83-46e1-a290-ec2717ef4d6e',
      alias: 'permissions:read@auth',
      name: 'read permission',
      description: 'access to read permission',
      permissionType: PermissionType.Security,
    },
  },
  // site module
  {
    where: { alias: 'sites:create@auth' },
    update: {},
    create: {
      id: '9f3b0da7-c9c2-4af5-ba0b-f92beb69bd01',
      alias: 'sites:create@auth',
      name: 'create site',
      description: 'access to create new site',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'sites:read@auth' },
    update: {},
    create: {
      id: '2c1b924f-8f44-46f4-a586-96a8311b99ca',
      alias: 'sites:read@auth',
      name: 'read site',
      description: 'access to read site',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'sites:update@auth' },
    update: {},
    create: {
      id: 'd967ac4e-ad84-4b1d-891f-8b1e2f8f1b31',
      alias: 'sites:update@auth',
      name: 'update specific site',
      description: 'access to update specific site data',
      permissionType: PermissionType.Security,
    },
  },
  {
    where: { alias: 'sites:delete@auth' },
    update: {},
    create: {
      id: 'e9f8ed8f-3a2e-468b-9397-5da8db36ff76',
      alias: 'sites:delete@auth',
      name: 'delete site',
      description: 'access to delete site',
      permissionType: PermissionType.Security,
    },
  },
  // Audit module
  {
    where: { alias: 'audit:read@auth' },
    update: {},
    create: {
      id: '1cf37cb6-48a3-11ed-b878-0242ac120002',
      alias: 'audit:read@auth',
      name: 'read audit',
      description: 'access to read audit',
      permissionType: PermissionType.Security,
    },
  },
];

export default permissions;
