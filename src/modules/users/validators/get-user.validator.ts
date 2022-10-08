import { Type } from 'class-transformer';
import { IsObject, IsUUID, ValidateNested } from 'class-validator';
import { IGetUserRequestParams } from '../requests/get-user.request';

class GetUserParamsValidator implements IGetUserRequestParams {
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
