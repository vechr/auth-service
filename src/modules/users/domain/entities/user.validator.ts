import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { User, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  TCreateUserRequestBody,
  TDeleteUserByIdRequestParams,
  TGetUserByIdRequestParams,
  TListUserRequestQuery,
  TUpdateUserByIdRequestParams,
  TUpdateUserRequestBody,
  TUpsertUserRequestBody,
} from './user.entity';
import {
  BaseCursorQueryValidator,
  BasePaginationQueryValidator,
  IListCursorRequest,
  IListPaginationRequest,
  ListQueryField,
  StringFilterQuery,
} from '@/core/base/domain/entities';
import {
  CreateValidator,
  IDValidator,
  IDsValidator,
  UpdateValidator,
} from '@/core/base/domain/entities/validator.entity';

// For field filter in list whether cursor or pagination
export class ListUserQueryField
  extends ListQueryField
  implements Prisma.UserWhereInput
{
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  email?: string | null;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  phoneNumber?: string | null;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterQuery)
  @ApiPropertyOptional({ type: StringFilterQuery })
  fullName?: string;
}

// Create filters class for Cursor Type
export class ListCursorUserQueryValidator extends BaseCursorQueryValidator<User> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryField)
  @ApiPropertyOptional({ type: ListUserQueryField })
  field?: ListUserQueryField;
}

// Create filters class for Pagination Type
export class ListPaginationUserQueryValidator extends BasePaginationQueryValidator<User> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListUserQueryField)
  @ApiPropertyOptional({ type: ListUserQueryField })
  field?: ListUserQueryField;
}

// implement filter class for Cursor Type
export class FilterCursorUserQueryValidator
  implements TListUserRequestQuery<IListCursorRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListCursorUserQueryValidator)
  filters: ListCursorUserQueryValidator;
}

// implement filter class for Pagination Type
export class FilterPaginationUserQueryValidator
  implements TListUserRequestQuery<IListPaginationRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPaginationUserQueryValidator)
  filters: ListPaginationUserQueryValidator;
}

export class CreateUserValidator
  extends CreateValidator
  implements TCreateUserRequestBody
{
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'John@company.com',
    description: 'Email User!',
  })
  email: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '085725653154',
    description: 'Phone Number User!',
  })
  phoneNumber: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'John D',
    description: 'Full name of user!',
  })
  fullName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({
    example: 'john123',
    description: 'Password User!',
  })
  password: string;

  @ApiProperty({
    example: 'john123',
    description: 'Must be same with password',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    example: ['5ae20ea0-4643-11ed-b878-0242ac120002'],
    description: 'You can attach role Group into this user!',
  })
  @IsArray()
  roles: string[];

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
    description: 'ID!',
  })
  siteId: string;
}

export class UpsertUserValidator
  extends CreateUserValidator
  implements TUpsertUserRequestBody {}

export class UpdateUserParamsValidator
  extends IDValidator
  implements TUpdateUserByIdRequestParams {}

export class GetUserParamsValidator
  extends IDValidator
  implements TGetUserByIdRequestParams {}

export class DeleteUserParamsValidator
  extends IDValidator
  implements TDeleteUserByIdRequestParams {}

export class DeleteUserBatchBodyValidator extends IDsValidator {}

export class UpdateUserValidator
  extends UpdateValidator
  implements TUpdateUserRequestBody
{
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'John@company.com',
    description: 'Email User!',
  })
  email: string | undefined;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '085725653154',
    description: 'Phone Number User!',
  })
  phoneNumber: string | undefined;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'John D',
    description: 'Full name of user!',
  })
  fullName: string | undefined;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  @ApiPropertyOptional({
    example: 'john123',
    description: 'Password User!',
  })
  password: string | undefined;

  @ApiPropertyOptional({
    example: 'john123',
    description: 'Harus sama dengan password',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  confirmPassword: string | undefined;

  @ApiPropertyOptional({
    example: ['5ae20ea0-4643-11ed-b878-0242ac120002'],
    description: 'You can attach role into this user!',
  })
  @IsArray()
  @IsOptional()
  roles: string[];

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '1def564a-42d9-4a94-9bf8-c9c6e4d796a6',
    description: 'ID!',
  })
  siteId: string;
}
