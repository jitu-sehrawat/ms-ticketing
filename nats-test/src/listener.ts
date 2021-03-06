import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';


console.clear();

// Creating Client to connect to nats streaming
const stan = nats.connect(
  'ticketing',
  new Date().getTime().toString(),
  {
    url: 'http://localhost:4222'
  }
);

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  })

  new TicketCreatedListener(stan).listen();
}); 

// Gracefull Shutdown.
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
