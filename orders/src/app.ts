import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@jitusehrawattickets/common'
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';

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

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
