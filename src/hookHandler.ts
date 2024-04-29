import { Request, Response, Router } from 'express';
import { header, param } from 'express-validator';
import { exec } from 'child_process';
import { checkSecret, validate } from './middlewares.js';
import { readConfig } from './readConfig.js';
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
    console.log('received hook on ' + req.params.hook);
    if (hook[0]) {
      exec(
        hook[0].script.toString(),
        (error: Error | null, stdout: string, stderr: string) => {
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
export default hookHandler;

interface Config {
  name: string;
  script: string;
}
