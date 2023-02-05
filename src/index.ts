import { Request, Response, Express } from 'express';
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const hookHandler = require('./hookhandler');
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
app.get('/:hook', (req: Request, res: Response) => {
  res.send('Insiflix API');
});

app.listen(process.env.PORT ?? 4000, () => {
  console.log(`express server is running on port ${process.env.PORT ?? 4000}`);
});
