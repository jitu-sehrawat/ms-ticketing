import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@jitusehrawattickets/common'
import { createChargeRouter } from './routes/new';

const app = express();
// Making express aware its running behind a nginx proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // For testing, secure should false(http), else true(https)
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);

app.use(createChargeRouter);
app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
