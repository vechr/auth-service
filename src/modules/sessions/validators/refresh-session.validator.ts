import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

import { IRefreshSessionRequestParams } from '../requests/refresh-session.request';

class RefreshSessionParamsValidator implements IRefreshSessionRequestParams {
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
