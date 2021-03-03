import express, { Request, Response } from 'express';
import { NotFoundError } from '@jitusehrawattickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/',
  async (req: Request, res: Response) => {
    const ticket = await Ticket.find({});
    
    if (!ticket) {
      throw new NotFoundError();
    }

    return res.send(ticket);
  }
);

export { router as indexTicketRouter };
