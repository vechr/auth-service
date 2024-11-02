<p align="center">
  <a href="" target="blank"><img src="./public/logo.svg" width="320" alt="Vechr Logo" /></a>
</p>

# Edit your `.env` file
```
DB_URL=postgresql://Vechr:123@postgres-db:5432/auth_db?schema=public&connect_timeout=300
INITIAL_SITE='{"code":"ST1","name":"Site Default","location":"Server Default"}'
INITIAL_SUPERUSER='{"fullName":"root","username": "root","emailAddress":"root@vechr.id","phoneNumber":"+62","password":"password123"}'
JWT_SECRET=secretvechr
ECRYPTED_SECRET=usersecret
JWT_EXPIRES_IN=3d
JWT_REFRESH_EXPIRES_IN=30d
NATS_URL=nats://nats-server:4222
```

# Running Auth Service
```bash
yarn install
yarn prisma:sync
yarn db:migrate
yarn db:studio
yarn watch
```

# Build Image for Production
```bash
chmod +x ./docker/build.sh
./docker/build.sh
```