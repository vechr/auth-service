import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { IUpdateUserRequestBody, IUpdateUserRequestParams } from '../requests/update-user.request';

export class UpdateUserBodyValidator implements IUpdateUserRequestBody {
  @ApiProperty({
    example: 'john@vechr.id',
    description: 'Insert your email in Here!',
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  emailAddress?: string;

  @ApiProperty({
    example: 'John is Senior Manager',
    description: 'Insert your description in Here!',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'john',
    description: 'Insert your username in Here!',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'John Pablo',
    description: 'Insert your fullname in Here!',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: '+62875892313',
    description: 'Insert your phone number in Here!',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: 'john123',
    description: 'Insert your password in Here!',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    example: 'john123',
    description: 'Insert your confirm password in Here!, make sure same as a password',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  confirmPassword: string;

  @ApiProperty({
    example: ['e9f8ed8f-3a2e-468b-9397-5da8db36ff76', '1cf37cb6-48a3-11ed-b878-0242ac120002'],
    description: 'You can attach role into this user!',
  })
  @IsArray()
  roles: string[];

  @ApiProperty({
    example: 'aa15c44d-ad6b-4bf8-b3e1-ef188761105e',
    description: 'Attach your Site Id to User in Here!',
  })
  @IsString()
  @IsOptional()
  siteId: string;
}

export class UpdateUserParamsValidator implements IUpdateUserRequestParams {
  @ApiProperty({
    example: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
    description: 'Insert your User Id in Here that you want to do something!',
  })
  @IsString()
  @IsUUID()
  id: string;
}

export default class UpdateUserValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => UpdateUserParamsValidator)
  params: UpdateUserParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => UpdateUserBodyValidator)
  body: UpdateUserBodyValidator;
}
