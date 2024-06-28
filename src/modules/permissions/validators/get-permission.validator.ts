import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsUUID, ValidateNested } from 'class-validator';

import { IGetPermissionRequestParams } from '../requests/get-permission.request';

export class GetPermissionParamsValidator implements IGetPermissionRequestParams {
  @ApiProperty({
    example: 'd8beca16-5296-458a-bc8a-609d217fed08',
    description: 'Insert your permission in Here!',
  })
  @IsUUID()
  id: string;
}

export default class GetPermissionValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetPermissionParamsValidator)
  params: GetPermissionParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
