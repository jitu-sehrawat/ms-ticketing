import { Publisher, OrderCancelledEvent, Subjects } from '@jitusehrawattickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}