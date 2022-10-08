import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

import { IDecryptedJwt, translator } from '@shared/utils/jwt.util';
import appConstant from '@constants/app.constant';
import UserService from '@modules/users/user.service';

import { TUserCustomInformation } from '@/shared/types/user.type';
import { transformUserToCustomInformation } from '@/shared/utils/user.util';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConstant.JWT_SECRET,
    });
  }

  async validate(jwt: IDecryptedJwt) {
    const customUser = await this.getCustomUser(jwt);

    return customUser;
  }

  private async getCustomUser(
    jwt: IDecryptedJwt,
  ): Promise<TUserCustomInformation> {
    const userId = translator.toUUID(jwt.sub);
    const user = await this.userService.findCompleteById(userId);

    if (!user) {
      throw new JsonWebTokenError('sub not valid');
    }

    const customUser = await transformUserToCustomInformation(user);

    return customUser;
  }
}
