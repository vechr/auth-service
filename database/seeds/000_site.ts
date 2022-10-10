import { Site } from '@prisma/client';
import appConstant from '../../src/constants/app.constant';

type TSiteSeed = {
  where: Partial<Site>;
  update: Partial<Site>;
  create: Partial<Site>;
}[];

const sites: TSiteSeed = [
  {
    where: { code: appConstant.INITIAL_SITE.code },
    update: {},
    create: {
      id: 'aa15c44d-ad6b-4bf8-b3e1-ef188761105e',
      code: appConstant.INITIAL_SITE.code,
      name: appConstant.INITIAL_SITE.name,
      location: appConstant.INITIAL_SITE.location,
    },
  },
];

export default sites;
