import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { ICreateSessionRequestBody } from '../requests/create-session.request';

export class CreateSessionBodyValidator implements ICreateSessionRequestBody {
  @ApiProperty({
    example: 'root',
    description: 'Insert your username in Here!',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Insert your Password in Here!',
  })
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
