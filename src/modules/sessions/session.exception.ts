import {
  BadRequestException,
  NotFoundException,
} from '@shared/exceptions/common.exception';

export enum ESessionErrorCode {
  USER_NOT_FOUND = '404',
  WRONG_PASSWORD = '401',
  INVALID_REFRESH_TOKEN = '401',
  REFRESH_TOKEN_EXPIRED = '401',
}

class UserNotFound extends NotFoundException {
  constructor(params: { username: string }) {
    super({
      message: 'user not found',
      code: ESessionErrorCode.USER_NOT_FOUND,
      params,
    });
  }
}

class WrongPassword extends BadRequestException {
  constructor() {
    super({
      message: 'wrong password',
      code: ESessionErrorCode.WRONG_PASSWORD,
    });
  }
}

class InvalidRefreshToken extends BadRequestException {
  constructor() {
    super({
      message: 'invalid refresh token',
      code: ESessionErrorCode.INVALID_REFRESH_TOKEN,
    });
  }
}

class RefreshTokenExpired extends BadRequestException {
  constructor(params: { expiredAt: string }) {
    super({
      message: `refresh token expired since ${params.expiredAt}`,
      code: ESessionErrorCode.REFRESH_TOKEN_EXPIRED,
      params,
    });
  }
}

export default {
  UserNotFound,
  WrongPassword,
  InvalidRefreshToken,
  RefreshTokenExpired,
};
