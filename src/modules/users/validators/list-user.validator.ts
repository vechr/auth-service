import { Prisma, User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TListUserRequestQuery } from '../requests/list-user.request';
import { BaseQueryValidator, OperatorQuery } from '@shared/types/query.type';

class ListUserQueryField implements Prisma.UserWhereInput {
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
  fullName?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  emailAddress?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  phoneNumber?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  username: OperatorQuery;

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

export class ListUserQueryValidator extends BaseQueryValidator<User> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryField)
  @ApiPropertyOptional({ type: ListUserQueryField })
  field?: ListUserQueryField;
}

class FilterUserQueryValidator implements TListUserRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryValidator)
  filters: ListUserQueryValidator;
}

export default class ListUserValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterUserQueryValidator)
  query: FilterUserQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
