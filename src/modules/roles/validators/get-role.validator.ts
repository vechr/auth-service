import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsUUID, ValidateNested } from 'class-validator';
import { IGetRoleRequestParams } from '../requests/get-role.request';

export class GetRoleParamsValidator implements IGetRoleRequestParams {
  @ApiProperty({
    example: '5ae20ea0-4643-11ed-b878-0242ac120002',
    description: 'Insert your site id in Here!',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export default class GetRoleValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetRoleParamsValidator)
  params: GetRoleParamsValidator;

  @IsObject()
  body: Record<string, any>;

  @IsObject()
  query: Record<string, any>;
}
