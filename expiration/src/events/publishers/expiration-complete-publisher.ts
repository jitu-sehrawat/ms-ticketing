import { Publisher, ExpirationCompleteEvent, Subjects } from "@jitusehrawattickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}