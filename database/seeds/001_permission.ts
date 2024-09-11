import { Permission } from '@prisma/client';

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
    },
  },
  // audit
  {
    where: { alias: 'audit:read@auth' },
    update: {},
    create: {
      id: '4f189165-d56d-4f71-a087-03f8838b5059',
      alias: 'audit:read@auth',
      name: 'read audit',
      description: 'access to read audit',
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
    },
  },
  {
    where: { alias: 'roles:read@auth' },
    update: {},
    create: {
      id: '9fa2361f-5441-451b-a613-e3d888d7b4a9',
      alias: 'roles:read@auth',
      name: 'read roles',
      description: 'access to read role data',
    },
  },
  {
    where: { alias: 'roles:update@auth' },
    update: {},
    create: {
      id: '26623b58-db0b-427f-8c4c-556dd2d78f99',
      alias: 'roles:update@auth',
      name: 'update specific roles',
      description: 'access to update specific role data',
    },
  },
  {
    where: { alias: 'roles:delete@auth' },
    update: {},
    create: {
      id: '6c80b595-90b9-4f3b-83b6-71c1dab3154d',
      alias: 'roles:delete@auth',
      name: 'delete roles',
      description: 'access to delete role',
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
    },
  },
  // Dashboard Module
  {
    where: { alias: 'dashboards:read@auth' },
    update: {},
    create: {
      id: '8a8c7de6-8e8f-499a-bb87-9870efec29b6',
      alias: 'dashboards:read@auth',
      name: 'read dashboards',
      description: 'access to read dashboards',
    },
  },
  {
    where: { alias: 'dashboards:create@auth' },
    update: {},
    create: {
      id: 'e663211a-49d8-11ed-b878-0242ac120002',
      alias: 'dashboards:create@auth',
      name: 'create dashboards',
      description: 'access to create dashboards',
    },
  },
  {
    where: { alias: 'dashboards:update@auth' },
    update: {},
    create: {
      id: '17d0d53a-49d9-11ed-b878-0242ac120002',
      alias: 'dashboards:update@auth',
      name: 'update dashboards',
      description: 'access to update dashboards',
    },
  },
  {
    where: { alias: 'dashboards:delete@auth' },
    update: {},
    create: {
      id: '23919cc4-49d9-11ed-b878-0242ac120002',
      alias: 'dashboards:delete@auth',
      name: 'delete dashboards',
      description: 'access to delete dashboards',
    },
  },
  // Device Module
  {
    where: { alias: 'devices:read@auth' },
    update: {},
    create: {
      id: '7447415a-49d9-11ed-b878-0242ac120002',
      alias: 'devices:read@auth',
      name: 'read devices',
      description: 'access to read devices',
    },
  },
  {
    where: { alias: 'devices:create@auth' },
    update: {},
    create: {
      id: '79777096-49d9-11ed-b878-0242ac120002',
      alias: 'devices:create@auth',
      name: 'create devices',
      description: 'access to create devices',
    },
  },
  {
    where: { alias: 'devices:update@auth' },
    update: {},
    create: {
      id: '7e776628-49d9-11ed-b878-0242ac120002',
      alias: 'devices:update@auth',
      name: 'update devices',
      description: 'access to update devices',
    },
  },
  {
    where: { alias: 'devices:delete@auth' },
    update: {},
    create: {
      id: '83783594-49d9-11ed-b878-0242ac120002',
      alias: 'devices:delete@auth',
      name: 'delete devices',
      description: 'access to delete devices',
    },
  },
  // Device Type Module
  {
    where: { alias: 'device-types:read@auth' },
    update: {},
    create: {
      id: 'cb1add34-49d9-11ed-b878-0242ac120002',
      alias: 'device-types:read@auth',
      name: 'read device type',
      description: 'access to read device type',
    },
  },
  {
    where: { alias: 'device-types:create@auth' },
    update: {},
    create: {
      id: 'd169fbd4-49d9-11ed-b878-0242ac120002',
      alias: 'device-types:create@auth',
      name: 'create device type',
      description: 'access to create device type',
    },
  },
  {
    where: { alias: 'device-types:update@auth' },
    update: {},
    create: {
      id: 'd625af9c-49d9-11ed-b878-0242ac120002',
      alias: 'device-types:update@auth',
      name: 'update device type',
      description: 'access to update device type',
    },
  },
  {
    where: { alias: 'device-types:delete@auth' },
    update: {},
    create: {
      id: 'dc144a26-49d9-11ed-b878-0242ac120002',
      alias: 'device-types:delete@auth',
      name: 'delete device type',
      description: 'access to delete device type',
    },
  },
  // Topic Module
  {
    where: { alias: 'topics:read@auth' },
    update: {},
    create: {
      id: '5d48c194-49da-11ed-b878-0242ac120002',
      alias: 'topics:read@auth',
      name: 'read topics',
      description: 'access to read topics',
    },
  },
  {
    where: { alias: 'topics:create@auth' },
    update: {},
    create: {
      id: '6271088e-49da-11ed-b878-0242ac120002',
      alias: 'topics:create@auth',
      name: 'create topics',
      description: 'access to create topics',
    },
  },
  {
    where: { alias: 'topics:update@auth' },
    update: {},
    create: {
      id: '66c4a6fc-49da-11ed-b878-0242ac120002',
      alias: 'topics:update@auth',
      name: 'update topics',
      description: 'access to update topics',
    },
  },
  {
    where: { alias: 'topics:delete@auth' },
    update: {},
    create: {
      id: '6c2b753a-49da-11ed-b878-0242ac120002',
      alias: 'topics:delete@auth',
      name: 'delete topics',
      description: 'access to delete topics',
    },
  },
  // Topic Event Module
  {
    where: { alias: 'topic-events:read@auth' },
    update: {},
    create: {
      id: 'fd17648c-49da-11ed-b878-0242ac120002',
      alias: 'topic-events:read@auth',
      name: 'read topic event',
      description: 'access to read topic event',
    },
  },
  {
    where: { alias: 'topic-events:create@auth' },
    update: {},
    create: {
      id: '01cbdfe4-49db-11ed-b878-0242ac120002',
      alias: 'topic-events:create@auth',
      name: 'create topic event',
      description: 'access to create topic event',
    },
  },
  {
    where: { alias: 'topic-events:update@auth' },
    update: {},
    create: {
      id: '0cc549ee-49db-11ed-b878-0242ac120002',
      alias: 'topic-events:update@auth',
      name: 'update topic event',
      description: 'access to update topic event',
    },
  },
  {
    where: { alias: 'topic-events:delete@auth' },
    update: {},
    create: {
      id: '11df5942-49db-11ed-b878-0242ac120002',
      alias: 'topic-events:delete@auth',
      name: 'delete topic event',
      description: 'access to delete topic event',
    },
  },
  // Widget Module
  {
    where: { alias: 'widgets:read@auth' },
    update: {},
    create: {
      id: 'd22f7fac-49da-11ed-b878-0242ac120002',
      alias: 'widgets:read@auth',
      name: 'read widgets',
      description: 'access to read widgets',
    },
  },
  {
    where: { alias: 'widgets:create@auth' },
    update: {},
    create: {
      id: 'd76e6f96-49da-11ed-b878-0242ac120002',
      alias: 'widgets:create@auth',
      name: 'create widgets',
      description: 'access to create widgets',
    },
  },
  {
    where: { alias: 'widgets:update@auth' },
    update: {},
    create: {
      id: 'dbc03962-49da-11ed-b878-0242ac120002',
      alias: 'widgets:update@auth',
      name: 'update widgets',
      description: 'access to update widgets',
    },
  },
  {
    where: { alias: 'widgets:delete@auth' },
    update: {},
    create: {
      id: 'e103c416-49da-11ed-b878-0242ac120002',
      alias: 'widgets:delete@auth',
      name: 'delete widgets',
      description: 'access to delete widgets',
    },
  },
  // Email Notification
  {
    where: { alias: 'email-notifications:read@auth' },
    update: {},
    create: {
      id: '53febaac-49db-11ed-b878-0242ac120002',
      alias: 'email-notifications:read@auth',
      name: 'read email notification',
      description: 'access to read email notification',
    },
  },
  {
    where: { alias: 'email-notifications:create@auth' },
    update: {},
    create: {
      id: '59f99bf2-49db-11ed-b878-0242ac120002',
      alias: 'email-notifications:create@auth',
      name: 'create email notification',
      description: 'access to create email notification',
    },
  },
  {
    where: { alias: 'email-notifications:update@auth' },
    update: {},
    create: {
      id: '5eff2db0-49db-11ed-b878-0242ac120002',
      alias: 'email-notifications:update@auth',
      name: 'update email notification',
      description: 'access to update email notification',
    },
  },
  {
    where: { alias: 'email-notifications:delete@auth' },
    update: {},
    create: {
      id: '641ecd14-49db-11ed-b878-0242ac120002',
      alias: 'email-notifications:delete@auth',
      name: 'delete email notification',
      description: 'access to delete email notification',
    },
  },
];

export default permissions;
