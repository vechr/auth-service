import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { ICreateSessionRequestBody } from '../requests/create-session.request';

class CreateSessionBodyValidator implements ICreateSessionRequestBody {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export default class CreateSessionValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateSessionBodyValidator)
  body: CreateSessionBodyValidator;
}
