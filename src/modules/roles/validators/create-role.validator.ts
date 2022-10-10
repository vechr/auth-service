import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
