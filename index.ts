import cookieParser from 'cookie-parser';
import express from "express";
import { serverConfig } from './server.config';


const app = express();

(async (config) => {

  try {

    const { connectionMethod, corsMethod, port, providerRouter, textRunServer } = config;

    app.use(cookieParser())
    app.use(express.json());


    const connection = await connectionMethod();

    providerRouter.forEach((data) => {
      app.use(data.path, data.generateRouter(new data.controller(new data.model({ method: connection }))))
    })

  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }


})(serverConfig)



