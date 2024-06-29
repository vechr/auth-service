import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserFull } from '../domain/entities/user.entity';
import { UserUseCase } from '../domain/usecase/user.usecase';

@Controller()
export default class UserNatsController {
  constructor(private _usecase: UserUseCase) {}

  @MessagePattern('auth.user.findCompleteById')
  public async findCompleteById(
    @Payload() { id }: { id: string },
  ): Promise<UserFull | null> {
    const result = await this._usecase.findCompleteById(id);

    return result;
  }

  @MessagePattern('auth.user.findCompleteByUsername')
  public async findCompleteByUsername(
    @Payload() { username }: { username: string },
  ): Promise<UserFull | null> {
    const result = await this._usecase.findCompleteByUsername(username);

    return result;
  }
}
