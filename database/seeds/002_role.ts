import { Prisma, Role } from '@prisma/client';

type TRoleSeed = {
  where: Partial<Role>;
  update: Partial<Role>;
  create: Partial<Prisma.RoleCreateInput>;
}[];

const roles = async (): Promise<TRoleSeed> => [
  {
    where: { name: 'root' },
    update: {},
    create: {
      id: '5ae20ea0-4643-11ed-b878-0242ac120002',
      name: 'root',
      description: 'Initial Administrator',
      permissions: {
        createMany: {
          data: {
            permissionId: 'd8beca16-5296-458a-bc8a-609d217fed08',
          },
        },
      },
    },
  },
];

export default roles();
