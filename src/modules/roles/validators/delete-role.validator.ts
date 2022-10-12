import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsUUID, ValidateNested } from 'class-validator';
import { IDeleteRoleRequestParams } from '../requests/delete-role.request';

export class DeleteRoleParamsValidator implements IDeleteRoleRequestParams {
  @ApiProperty({
    example: '5ae20ea0-4643-11ed-b878-0242ac120002',
    description: 'Insert your site id in Here!',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export default class DeleteRoleValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => DeleteRoleParamsValidator)
  params: DeleteRoleParamsValidator;

  @IsObject()
  body: Record<string, any>;

  @IsObject()
  query: Record<string, any>;
}
