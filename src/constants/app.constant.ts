import * as env from 'env-var';

import dotenv = require('dotenv');
import { Site, User } from '@prisma/client';
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  INITIAL_SITE: JSON.parse(process.env.INITIAL_SITE || '{}') as Partial<Site>,
  INITIAL_SUPERUSER: JSON.parse(
    process.env.INITIAL_SUPERUSER || '{}',
  ) as Partial<User>,
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  JWT_REFRESH_EXPIRES_IN: env
    .get('JWT_REFRESH_EXPIRES_IN')
    .default('30d')
    .asString(),
  NATS_URL: env.get('NATS_URL').required().asString(),
  NATS_SERVICE: 'NATS_SERVICE',
});
