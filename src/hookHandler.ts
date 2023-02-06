import { Request, Response, Router } from 'express';
import { header, param } from 'express-validator';
const { exec } = require('child_process');
const { checkSecret, validate } = require('./middlewares');
const { readConfig } = require('./readConfig');
const hookHandler: Router = Router();

const config: Config[] = readConfig();

hookHandler.post(
  '/:hook',
  header('x-hub-signature').isString().notEmpty(),
  param('hook').isString().notEmpty(),
  validate,
  checkSecret,
  (req: Request, res: Response) => {
    const hook = config.filter((e) => e.name === req.params.hook);
    if (hook[0]) {
      exec(
        hook[0].script.toString(),
        (error: Error, stdout: string, stderr: Error) => {
          if (error) {
            console.log(`error: ${error.message}`);
            res.sendStatus(500);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.sendStatus(400);

            return;
          }
          console.log(`stdout: ${stdout}`);
          res.sendStatus(200);
        }
      );
    } else {
      res.sendStatus(400);
    }
  }
);

interface Config {
  name: string;
  script: string;
}

module.exports = hookHandler;
