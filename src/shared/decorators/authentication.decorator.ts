import { UseGuards } from '@nestjs/common';

import { AuthenticationGuard } from '../guards/authentication.guard';

export default function Authentication(auth: boolean) {
  if (auth) {
    return UseGuards(AuthenticationGuard);
  }
  return () => {
    return;
  };
}
