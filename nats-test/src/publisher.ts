import nats from 'node-nats-streaming';

console.clear();

// Creating Client to connect to nats streaming
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  // In NATS only number and strings are allowed
  // So stringify the data.
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 30
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});