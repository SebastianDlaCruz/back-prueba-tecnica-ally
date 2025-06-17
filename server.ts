import cors from 'cors';
import { Router } from "express";
import { PoolConnection } from "mysql2/promise";
import { getConnectionDB } from "./src/config/connection-db/connection-db.config";
import { AuthController } from "./src/controllers/auth/auth.controller";
import { CountryController } from './src/controllers/county/country.controller';
import { TaskController } from './src/controllers/task/task.controller';
import { AuthModel } from "./src/models/auth/auth.model";
import { CountryModel } from './src/models/country/country.model';
import { TaskModel } from './src/models/task/task.model';
import { authRouter } from "./src/routes/auth/auth.router";
import { countryRouter } from './src/routes/county/country.router';
import { taskRouter } from './src/routes/task/task.router';

interface ProviderRouter {
  path: string;
  controller: any;
  model: any;
  generateRouter: (controller: any) => Router;
}


export interface ServerConfig<T> {
  port: number;
  connectionMethod: () => Promise<T>;
  corsMethod: () => any;
  providerRouter: ProviderRouter[];
  textRunServer: string;

}

const { PORT } = process.env;
const path = '/api/v1';

export const serverConfig: ServerConfig<PoolConnection> = {
  port: parseInt(PORT ?? '') ?? 3000,
  connectionMethod: getConnectionDB,
  corsMethod: cors,
  providerRouter: [
    {
      path: `${path}/auth`,
      controller: AuthController,
      generateRouter: authRouter,
      model: AuthModel
    },
    {
      path: `${path}/county`,
      controller: CountryController,
      generateRouter: countryRouter,
      model: CountryModel
    },
    {
      path: `${path}/task`,
      controller: TaskController,
      generateRouter: taskRouter,
      model: TaskModel
    }

  ],
  textRunServer: "live server in localhost"
}