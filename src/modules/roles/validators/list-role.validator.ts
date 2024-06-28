import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { TListRoleRequestQuery } from '../requests/list-role.request';
import { BaseQueryValidator, OperatorQuery } from '@shared/types/query.type';

export class ListRoleQueryField implements Prisma.RoleWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  id?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  @ApiPropertyOptional({ type: OperatorQuery })
  name?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  description?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  createdAt?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  updatedAt?: OperatorQuery;
}

export class ListRoleQueryValidator extends BaseQueryValidator<Role> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListRoleQueryField)
  @ApiPropertyOptional({ type: ListRoleQueryField })
  field?: ListRoleQueryField;
}

class FilterRoleQueryValidator implements TListRoleRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListRoleQueryValidator)
  filters: ListRoleQueryValidator;
}

export default class ListRoleValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterRoleQueryValidator)
  query: FilterRoleQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
