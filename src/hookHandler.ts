import { Request, Response, Router } from 'express';
import { header } from 'express-validator';
const { checkSecret, validate } = require('./middlewares');

const hookHandler: Router = Router();

hookHandler.post(
  '/:hook',
  validate,
  checkSecret,
  header('x-hub-signature').isString().notEmpty(),
  (req: Request, res: Response) => {}
);

module.exports = { hookHandler };
