import { NotFoundException } from '@shared/exceptions/common.exception';

export enum EPermissionErrorCode {
  PERMISSION_NOT_FOUND = '404',
}

class PermissionNotFound extends NotFoundException {
  constructor(params: { id: string }) {
    super({
      message: 'permission not found',
      code: EPermissionErrorCode.PERMISSION_NOT_FOUND,
      params,
    });
  }
}

export default {
  PermissionNotFound,
};
