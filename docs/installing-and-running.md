# Installation

## Setup

You first need to run `npm install` to install all dependencies.

After that you need to initialize `.env` file. Needed variables are these:
``` .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=erincayaz
DB_PASSWORD=123
DB_NAME=qlub
APP_PORT=3000
JWT_SECRET=supersecret
```
You can set these according to local variables.

After setting `.env` files, you need to run the project using `npm start`. With that your tables are created but it is not done yet, you also need to run migrations and seeds as well. For that you can run:
``` bash
npm run db:migrate
npm run db:seed
```

Now your project is ready to accept requests.

