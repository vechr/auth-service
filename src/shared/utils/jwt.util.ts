import ms from 'ms';
import * as jwt from 'jsonwebtoken';
import suuid from 'short-uuid';

import appConstant from '@constants/app.constant';
import CryptoJS from 'crypto-js';
import { TUserCustomInformation } from '../types/user.type';
import { rand, sha512 } from './security.util';

export interface IGeneratedJwt {
  refresh: string;
  token: string;
  expired: Date;
}

export interface IDecryptedJwt {
  payload: string;
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
  siteCode,
  user,
}: {
  origin: string;
  userId: string;
  siteCode: string;
  user: TUserCustomInformation;
}): Promise<IGeneratedJwt> => {
  const refresh = await generateRefresh();
  const token = jwt.sign(
    { payload: encryptedDataUser(user) },
    appConstant.JWT_SECRET,
    {
      expiresIn: appConstant.JWT_EXPIRES_IN,
      subject: translator.fromUUID(userId),
      audience: origin,
      issuer: `vechr:${siteCode}`,
    },
  );

  const expired = generateExpiredDate();

  return {
    refresh,
    token,
    expired,
  };
};

export const encryptedDataUser = (user: TUserCustomInformation) => {
  return encodeURIComponent(
    CryptoJS.AES.encrypt(
      JSON.stringify(user),
      appConstant.ECRYPTED_SECRET,
    ).toString(),
  );
};

export const decryptedDataUser = (secureData: string) => {
  const deData = CryptoJS.AES.decrypt(
    decodeURIComponent(secureData),
    appConstant.ECRYPTED_SECRET,
  );

  if (!isJsonString(deData.toString(CryptoJS.enc.Utf8))) {
    return null;
  }

  return JSON.parse(
    deData.toString(CryptoJS.enc.Utf8),
  ) as TUserCustomInformation;
};

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
