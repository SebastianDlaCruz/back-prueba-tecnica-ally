import { getConnectionDB } from "@config/index";
import { Router } from "express";
import { PoolConnection } from "mysql2/promise";
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


export const serverConfig: ServerConfig<PoolConnection> = {
  port: parseInt(PORT ?? '') ?? 3000,
  connectionMethod: getConnectionDB,
  corsMethod: function () {

  },
  providerRouter: [],
  textRunServer: ""
}