import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import {natsWrapper} from '../../nats-wrapper'
import { Ticket } from '../../models/ticket';

it('return 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdsad', price: 20
    })
    .expect(404);
});

it('return 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdsad', price: 20
    })
    .expect(401);
});

it('return 401 if the user doesnt own the ticket', async () => {
  const response =  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdsad', price: 20
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'wgwrgw', price: 22
    })
    .expect(401);
});

it('return 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response =  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdsad', price: 20
    })
    .expect(201);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '', price: 20
      })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'asdsad', price: -20
      })
      .expect(400);
});

it('update the ticket provided valid input', async () => {
  const cookie = global.signin();
  const response =  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdsad', price: 20
    })
    .expect(201);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'Bat', price: 200
      })
      .expect(200);

    const ticket = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

    expect(ticket.body.title).toEqual('Bat');
    expect(ticket.body.price).toEqual(200);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response =  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdsad', price: 20
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Bat', price: 200
    })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const response =  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdsad', price: 20
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString()})
  ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Bat', price: 200
    })
    .expect(400);
});