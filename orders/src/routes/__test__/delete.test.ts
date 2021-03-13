import { OrderStatus, Order } from '../../models/order';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'convert',
    price: 20
  });
  await ticket.save();
  
  return ticket;
}

it('mark a order a CANCELLED', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();

  const userOne = global.signin();
  // Create one order as User #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to cancel order for user #1
  await request(app)
    .delete(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204);

  const response = await Order.findById(orderOne.id);

  expect(response!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  // Create three tickets
  const ticketOne = await buildTicket();

  const userOne = global.signin();
  // Create one order as User #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to cancel order for user #1
  await request(app)
    .delete(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});