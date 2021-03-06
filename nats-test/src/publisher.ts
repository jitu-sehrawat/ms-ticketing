import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// Creating Client to connect to nats streaming
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  // In NATS only number and strings are allowed
  // So stringify the data.
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 30
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 30
    });
  } catch (error) {
    console.error(error);
  }

});