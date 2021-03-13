import { Ticket } from '../ticket'

it('Implements Optimistic concurrency control (OCC)', async () => {
  // Create an instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123'
  });

  // save to DB
  await ticket.save();

  // fetch the ticket twice
  const firstIntance = await Ticket.findById(ticket.id);
  const secondIntance = await Ticket.findById(ticket.id);

  // make two seperate changes to the tickets we fetched
  firstIntance!.set({ price: 10 });
  secondIntance!.set({ price: 15 });

  // save the first fetched ticket
  await firstIntance!.save();

  // save the second fetched ticket and expect an error
  // Below is syntax to check if any test can throw error.
  // expect needs to be awaited, not the called fn
  await expect(secondIntance!.save()).rejects.toThrow();
});

it('increments the version number on each save/update', async () => {
  // Create an instance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123'
  });

  // save to DB
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);

});