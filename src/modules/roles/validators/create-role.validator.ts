import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ICreateRoleRequestBody } from '../requests/create-role.request';

export class CreateRoleBodyValidator implements ICreateRoleRequestBody {
  @ApiProperty({
    example: 'Role Site',
    description: 'Insert your role name in Here!',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is role for Modelling Description',
    description: 'Insert your role description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['e9f8ed8f-3a2e-468b-9397-5da8db36ff76', '1cf37cb6-48a3-11ed-b878-0242ac120002'],
    description: 'You can attach permission into this role!',
  })
  @IsArray()
  permissions: string[];
}

export default class CreateRoleValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateRoleBodyValidator)
  body: CreateRoleBodyValidator;
}
