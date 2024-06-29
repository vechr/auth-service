import { PermissionModule } from '@/modules/permissions/permission.module';
import RoleModule from '@/modules/roles/role.module';
import UserModule from '@/modules/users/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, RoleModule, PermissionModule],
})
export class RegistrationModule {}
