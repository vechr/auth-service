import { PrismaClient } from '@prisma/client';
import { glob } from 'glob';
import { utilities, WinstonModuleOptions } from 'nest-winston';
import winston, { transports } from 'winston';

const winstonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.ms(),
  utilities.format.nestLike('Prisma Seed', {
    colors: true,
    prettyPrint: true,
  }),
);

const consoleTransport = new transports.Console({
  format: winstonFormat,
});

const winstonModuleOptions: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  transports: [consoleTransport],
};

const log = winston.createLogger(winstonModuleOptions);

const prisma = new PrismaClient();

(async function () {
  await prisma.$transaction(async (trx) => {
    log.info('start seeding ...');

    const seedFiles = glob.sync(`${__dirname}/**/*.js`);
    const orderedSeedFiles = seedFiles.slice().sort();

    for await (const seedFile of orderedSeedFiles) {
      const fileNameWithExt = seedFile.split('/').slice().pop();
      const fileName = fileNameWithExt?.replace('.js', '');

      if (
        fileNameWithExt &&
        fileName &&
        fileNameWithExt !== 'seed.js' &&
        fileNameWithExt !== 'seed-prod.js'
      ) {
        const path = seedFile.replace(__dirname, '.').replace('.js', '');

        try {
          const seedData = await (await import(path)).default;

          log.info(`run seeding for ${fileName}`);

          await Promise.all(
            seedData.map(async (data: Record<string, any>) => {
              const modelName = fileName.split('_').slice().pop();

              if (modelName) {
                await trx[modelName].upsert(data);

                log.info(`success seed for ${fileName}`);
              }
            }),
          );
        } catch (error) {
          log.warn(`skipped seeding on ${fileName}, ${error}`);
        }
      }
    }
  });
})()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
