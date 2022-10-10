import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

import { IRefreshSessionRequestParams } from '../requests/refresh-session.request';

export class RefreshSessionParamsValidator
  implements IRefreshSessionRequestParams
{
  @ApiProperty({
    example:
      '7ca3c130dc97750669c7fdb9a2773e75538ba8c557751969b77d8a54186481fa1f50695e34fc40b236f48b33e394a99a58a9e04783ef2a5f099e9e600b45a2c4',
    description: 'Insert your refresh token in Here!',
  })
  @IsString()
  refresh: string;
}

export default class RefreshSessionValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => RefreshSessionParamsValidator)
  params: RefreshSessionParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
