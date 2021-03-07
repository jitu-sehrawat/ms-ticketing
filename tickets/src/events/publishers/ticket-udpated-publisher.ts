import { Publisher, Subjects, TicketUpdatedEvent } from '@jitusehrawattickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
