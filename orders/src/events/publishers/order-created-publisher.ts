import { Publisher, OrderCreatedEvent, Subjects} from '@jitusehrawattickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}