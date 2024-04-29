import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

export const checkSecret = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const signature = req.headers['x-hub-signature'];
  if (!signature) {
    console.error('Webhook request does not have a signature');
    res.sendStatus(400);
    return;
  }
  const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECRET!);
  const digest = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    console.error('Webhook request signature is invalid');
    res.sendStatus(400);
    return;
  }

  next();
};

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
