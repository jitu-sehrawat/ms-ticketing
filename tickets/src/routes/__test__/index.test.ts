import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = () => {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'asds', price: 20
  })
}

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const ticketResponse = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200);

  expect(ticketResponse.body.length).toEqual(3);
});