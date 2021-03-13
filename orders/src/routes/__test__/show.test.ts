import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'convert',
    price: 20
  });
  await ticket.save();
  
  return ticket;
}

it('fetch particular order a user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();

  const userOne = global.signin();
  // Create one order as User #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to get order for user #1
  const response = await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);

  // Make sure we only got the orders for User #1\
  expect(response.body.id).toEqual(orderOne.id);
});

it('returns an error if one user tries tpo fetch other user order', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();

  const userOne = global.signin();
  // Create one order as User #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to get order for user #1
  await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});