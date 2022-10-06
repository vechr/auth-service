import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  JWT_REFRESH_EXPIRES_IN: env
    .get('JWT_REFRESH_EXPIRES_IN')
    .default('30d')
    .asString(),
  NATS_URL: env.get('NATS_URL').required().asString(),
  NATS_SERVICE: 'NATS_SERVICE',
});
