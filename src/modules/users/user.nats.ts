import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import UserService from './user.service';
import { TUserFullInformation } from '@/core/base/frameworks/shared/types/user.type';

@Controller()
export default class UserNatsController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('auth.user.findCompleteById')
  public async findCompleteById(@Payload() { id }: { id: string }): Promise<TUserFullInformation> {
    const result = await this.userService.findCompleteById(id);

    return result;
  }

  @MessagePattern('auth.user.findCompleteByUsername')
  public async findCompleteByUsername(
    @Payload() { username }: { username: string },
  ): Promise<TUserFullInformation> {
    const result = await this.userService.findCompleteByUsername(username);

    return result;
  }
}
