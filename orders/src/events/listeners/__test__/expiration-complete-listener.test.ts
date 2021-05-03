import { OrderStatus, ExpirationCompleteEvent } from "@jitusehrawattickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  // create an intance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'cocert',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asd',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // create a fake nats message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  // call the onMessage fn with data + message
  await listener.onMessage(data, msg);

  // write assertion to make sure a ticket was created
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emit an Ordercancelled Event', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  // call the onMessage fn with data + message
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
});

it('acks the msg', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  // call the onMessage fn with data + message
  await listener.onMessage(data, msg);

  // write assertion to make sure ack is called
  expect(msg.ack).toHaveBeenCalled();
});