import { NotFoundException } from '@shared/exceptions/common.exception';

export enum ESiteErrorCode {
  SITE_NOT_FOUND = '404',
  DUPLICATE_SITE = '401',
}

class SiteNotFound extends NotFoundException {
  constructor(params: { id: string }) {
    super({
      message: 'site not found',
      code: ESiteErrorCode.SITE_NOT_FOUND,
      params,
    });
  }
}

class DuplicateSite extends NotFoundException {
  constructor(params: { code: string }) {
    super({
      message: 'duplicate site identifier',
      code: ESiteErrorCode.DUPLICATE_SITE,
      params,
    });
  }
}

export default {
  SiteNotFound,
  DuplicateSite,
};
