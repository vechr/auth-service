import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsUUID, ValidateNested } from 'class-validator';
import { IGetUserRequestParams } from '../requests/get-user.request';

export class GetUserParamsValidator implements IGetUserRequestParams {
  @ApiProperty({
    example: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
    description: 'Insert your id user in Here!',
  })
  @IsUUID()
  id: string;
}

export default class GetUserValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetUserParamsValidator)
  params: GetUserParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
