import { Router, Request, Response } from 'express';
import { validacijaPodatakaOdgovora } from '../validators/answers/AnswerValidator';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { IAnswerService } from '../../Domain/services/answers/IAnswerService';

export class AnswerController {
  private router: Router;
  private answerService: IAnswerService;

  constructor(answerService: IAnswerService) {
    this.router = Router();
    this.answerService = answerService;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/answer/All',authenticate, this.dobaviSveOdgovore);
    this.router.post('/answer/Add', authenticate,this.kreirajOdgovor);
    this.router.get('/answer/GetId/:id',authenticate, this.dobaviOdgovorPoId);
    this.router.get('/answer/ForQuestion/:pitanje_id',authenticate, this.dobaviOdgovoreZaPitanje);
    this.router.delete('/answer/Delete/:id',authenticate, this.obrisiOdgovor);
  }

    public getRouter(): Router {
    return this.router;
  }

  private dobaviSveOdgovore = async (req: Request, res: Response) => {
    try {
      const odgovori = await this.answerService.dobaviSveOdgovore();
      res.status(200).json(odgovori);
    } catch (error) {
      console.error('Greška pri dohvaćanju svih odgovora:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju svih odgovora' });
    }
  };

  private kreirajOdgovor = async (req: Request, res: Response) => {
    try {
      const { pitanje_id, tekst_odgovora, tacan } = req.body;

      // Validacija pitanje_id
      if (!pitanje_id || isNaN(Number(pitanje_id)) || Number(pitanje_id) <= 0) {
        return res.status(400).json({ success: false, message: 'Neispravan ID pitanja.' });
      }

      // Validacija tekst_odgovora
      const rezultat = validacijaPodatakaOdgovora(tekst_odgovora);
      if (!rezultat.uspesno) {
        return res.status(400).json({ success: false, message: rezultat.poruka });
      }

      // Kreiraj odgovor
      const noviOdgovor = await this.answerService.kreirajOdgovor(
        Number(pitanje_id),
        tekst_odgovora,
        Boolean(tacan)
      );

      if (noviOdgovor.id !== 0) {
        return res.status(201).json({
          success: true,
          message: 'Odgovor uspešno kreiran',
          data: noviOdgovor,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Došlo je do greške prilikom kreiranja odgovora.',
        });
      }
    } catch (error) {
      console.error('Greška pri kreiranju odgovora:', error);
      res.status(500).json({ message: 'Greška pri kreiranju odgovora' });
    }
  };

  private dobaviOdgovorPoId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Neispravan ID odgovora' });
      }

      const odgovor = await this.answerService.dobaviOdgovorPoId(id);

      if (odgovor.id !== 0) {
        return res.status(200).json(odgovor);
      } else {
        return res.status(404).json({ message: 'Odgovor nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju odgovora po ID:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju odgovora' });
    }
  };

  private dobaviOdgovoreZaPitanje = async (req: Request, res: Response) => {
    try {
      const pitanje_id = Number(req.params.pitanje_id);

      if (isNaN(pitanje_id) || pitanje_id <= 0) {
        return res.status(400).json({ message: 'Neispravan ID pitanja' });
      }

      const odgovori = await this.answerService.dobaviOdgovoreZaPitanje(pitanje_id);
      res.status(200).json(odgovori);
    } catch (error) {
      console.error('Greška pri dohvatanju odgovora za pitanje:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju odgovora za pitanje' });
    }
  };

  private obrisiOdgovor = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Neispravan ID odgovora' });
      }

      const obrisano = await this.answerService.obrisiOdgovor(id);

      if (obrisano) {
        return res.status(200).json({ success: true, message: 'Odgovor uspešno obrisan' });
      } else {
        return res.status(404).json({ success: false, message: 'Odgovor nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri brisanju odgovora:', error);
      res.status(500).json({ message: 'Greška pri brisanju odgovora' });
    }
  };
}
