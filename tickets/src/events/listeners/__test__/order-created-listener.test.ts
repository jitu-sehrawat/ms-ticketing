import { OrderCreatedEvent, OrderStatus } from "@jitusehrawattickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdasfasfdaf'
  });
  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: 'asdasdd',
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // create a fake nats message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg, ticket };
};

it('sets the orderId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  // call the onMessage fn with data + message
  await listener.onMessage(data, msg);

  // write assertion to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the msg', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage fnwith data + message
  await listener.onMessage(data, msg);

  // write assertion to make sure ack is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage fnwith data + message
  await listener.onMessage(data, msg);

  // write assertion to make sure ticket update event is published
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});