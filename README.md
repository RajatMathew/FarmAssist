### FarmAssist - Team MaxQ - Nasa SpaceAppChallenge 2024

Live demo: https://bit.ly/FarmAssist-Maxq

#### Running steps

#### For initializing the database run

```
docker compose up
```

### Steps to run the spaceapp backend

```
cd backend
```

> Do use your package manager of choice (Deno 2 just dropped )

```
npm i
```

```
npx prisma generate
```

```
npx prisma migrate dev
```

```
npm run start
```

### Steps to run the spaceapp frontend

```
cd frontend
```

> Do use your package manager of choice (bun is fast as hell)

```
npm i
```

```
npm run dev
```
