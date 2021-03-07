import { Publisher, Subjects, TicketCreatedEvent } from '@jitusehrawattickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
