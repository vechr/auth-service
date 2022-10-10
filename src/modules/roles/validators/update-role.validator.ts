import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  IUpdateRoleRequestBody,
  IUpdateRoleRequestParams,
} from '../requests/update-role.request';

export class UpdateRoleBodyValidator implements IUpdateRoleRequestBody {
  @ApiProperty({
    example: 'Role Site',
    description: 'Insert your role name in Here!',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'This is role for Modelling Description',
    description: 'Insert your role description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [
      'e9f8ed8f-3a2e-468b-9397-5da8db36ff76',
      '1cf37cb6-48a3-11ed-b878-0242ac120002',
    ],
    description: 'You can attach permission into this role!',
  })
  @IsArray()
  permissions: string[];
}

export class UpdateRoleParamsValidator implements IUpdateRoleRequestParams {
  @ApiProperty({
    example: '5ae20ea0-4643-11ed-b878-0242ac120002',
    description: 'Insert your role id in Here!',
  })
  @IsUUID()
  id: string;
}

export default class UpdateRoleValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => UpdateRoleBodyValidator)
  body: UpdateRoleBodyValidator;
}
