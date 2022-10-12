import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsUUID, ValidateNested } from 'class-validator';
import { IDeleteUserRequestParams } from '../requests/delete-user.request';

export class DeleteUserParamsValidator implements IDeleteUserRequestParams {
  @ApiProperty({
    example: '9fc509dd-2cae-433e-b9ee-705d92c56d9c',
    description: 'Insert your id user in Here!',
  })
  @IsUUID()
  id: string;
}

export default class DeleteUserValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => DeleteUserParamsValidator)
  params: DeleteUserParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
