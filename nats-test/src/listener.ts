import nats, { Message } from 'node-nats-streaming';

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

  // Options for subscription
  const options = stan
    .subscriptionOptions()
    .setDurableName(`order-service`) // Durable sub
    .setDeliverAllAvailable() // Re-deliver missed Events
    .setManualAckMode(true); // setting Manual ACK.
  
    const subscription = stan.subscribe(
    'ticket:created',   // Event Name
    'order-service-QG', // Queue Group and Also persist durable subscriptions
    options
  );

  subscription.on('message', (msg: Message) => {
    console.log('Message recieved');
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }

    // Acknowledgment
    msg.ack();
  });
}); 

// Gracefull Shutdown.
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());