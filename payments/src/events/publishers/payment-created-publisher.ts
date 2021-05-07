import { Publisher, paymentCreatedEvent, Subjects } from "@jitusehrawattickets/common";


export class PaymentCreatedPublisher extends Publisher<paymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}