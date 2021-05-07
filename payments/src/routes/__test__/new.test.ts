import { OrderStatus } from '@jitusehrawattickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { natsWrapper } from '../../nats-wrapper';
import { stripe } from '../../stripe';

// jest.mock('../../stripe');

it('returns a 404 when purchasing aorder that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdsad',
      orderId: mongoose.Types.ObjectId()
    })
    .expect(404);
});

it('return a 401 when purchaisng an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 100,
    status: OrderStatus.Created,
    version: 0
  });
  order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdsad',
      orderId: order.id
    })
    .expect(401);
});

it('returns 400 when purchasing a cancelled order', async () => {
  let userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 100,
    status: OrderStatus.Cancelled,
    version: 0
  });
  order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'asdsad',
      orderId: order.id
    })
    .expect(400);
});

it('resturns a 201 with valid inpits', async () => {
  let userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: price,
    status: OrderStatus.Created,
    version: 0
  });
  order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  // Mock implementation
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.currency).toEqual('inr');
  // expect(chargeOptions.amount).toEqual(100000 * 100);
  // Mock implementation

  // Calling Stripe API
  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge?.currency).toEqual('inr');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});
