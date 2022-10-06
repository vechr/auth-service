import ms from 'ms';
import * as jwt from 'jsonwebtoken';
import suuid from 'short-uuid';

import appConstant from '@constants/app.constant';
import { rand, sha512 } from './security.util';

export interface IGeneratedJwt {
  refresh: string;
  token: string;
  expired: Date;
}

export interface IDecryptedJwt {
  aud: string;
  iss: string;
  sub: string;
  exp: number;
  iat: number;
}

export const translator = suuid();

export const generateRefresh = async (): Promise<string> => {
  const randStr = await rand(64);
  const random = `${randStr}-${Date.now()}`;
  const refresh = await sha512(random);

  return refresh;
};

export const generateExpiredDate = (): Date => {
  const expIn = appConstant.JWT_REFRESH_EXPIRES_IN;

  return new Date(Date.now() + ms(expIn));
};

export const generateJwt = async ({
  origin,
  userId,
  factoryCode,
}: {
  origin: string;
  userId: string;
  factoryCode: string;
}): Promise<IGeneratedJwt> => {
  const refresh = await generateRefresh();

  const token = jwt.sign({}, appConstant.JWT_SECRET, {
    expiresIn: appConstant.JWT_EXPIRES_IN,
    subject: translator.fromUUID(userId),
    audience: origin,
    issuer: `vechr:${factoryCode}`,
  });

  const expired = generateExpiredDate();

  return {
    refresh,
    token,
    expired,
  };
};
