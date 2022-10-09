import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ICreateUserRequestBody } from '../requests/create-user.request';

export class CreateUserBodyValidator implements ICreateUserRequestBody {
  @ApiProperty({
    example: 'John Pablo',
    description: 'Insert your fullname in Here!',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'john@vechr.id',
    description: 'Insert your email in Here!',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    example: 'John is Senior Manager',
    description: 'Insert your description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'john',
    description: 'Insert your username in Here!',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '+62875892313',
    description: 'Insert your phone number in Here!',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: 'john123',
    description: 'Insert your password in Here!',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'john123',
    description:
      'Insert your confirm password in Here!, make sure same as a password',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  confirmPassword: string;
}

export default class CreateUserValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateUserBodyValidator)
  body: CreateUserBodyValidator;
}
