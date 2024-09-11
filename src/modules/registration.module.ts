import { PermissionModule } from '@/modules/permissions/permission.module';
import RoleModule from '@/modules/roles/role.module';
import UserModule from '@/modules/users/user.module';
import { Module } from '@nestjs/common';
import SiteModule from '@/modules/sites/site.module';

@Module({
  imports: [UserModule, RoleModule, PermissionModule, SiteModule],
})
export class RegistrationModule {}
