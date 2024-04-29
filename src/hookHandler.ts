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
    if (hook[0]) {
      res.status(200).json({ message: 'hook found and executed' });
      exec(
        hook[0].script.toString(),
        (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
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
