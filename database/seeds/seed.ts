import glob from 'glob';
import { PrismaClient } from '@prisma/client';
import winston, { transports } from 'winston';
import { utilities } from 'nest-winston';

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

const winstonModuleOptions = {
  levels: winston.config.npm.levels,
  transports: [consoleTransport],
};

const log = winston.createLogger(winstonModuleOptions);

const prisma = new PrismaClient();

(async function () {
  await prisma.$transaction(async (trx) => {
    log.info('start seeding ...');

    const seedFiles = glob.sync(`${__dirname}/**/*.ts`);
    const orderedSeedFiles = seedFiles.slice().sort();

    for await (const seedFile of orderedSeedFiles) {
      const fileNameWithExt = seedFile.split('/').slice().pop();
      const fileName = fileNameWithExt?.replace('.ts', '');

      if (
        fileNameWithExt &&
        fileName &&
        fileNameWithExt !== 'seed.ts' &&
        fileNameWithExt !== 'seed-prod.ts'
      ) {
        const path = seedFile.replace(__dirname, '.').replace('.ts', '');

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
