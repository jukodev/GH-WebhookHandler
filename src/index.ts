import { Request, Response, Express } from 'express';
import { Config } from './readConfig.js';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import hookHandler from './hookHandler.js';
import { readConfig } from './readConfig.js';
const app: Express = express();

app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', hookHandler);

app.listen(process.env.PORT ?? 4000, () => {
  console.log(
    `express server is running on port ${process.env.PORT ?? 4000} with hooks:`
  );
  const config: Config[] = readConfig();
  config.forEach((hook) => {
    console.log(`   ${hook.name} -> ${hook.script}`);
  });
});
