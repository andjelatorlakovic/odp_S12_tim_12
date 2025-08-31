import { Router, Request, Response } from 'express';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { AnswerService } from '../../Services/answers/AnswerService';

export class AnswerController {
  private router = Router();
  private answerService: AnswerService;

  constructor(answerService: AnswerService) {
    this.answerService = answerService;

    // Definisanje ruta
    this.router.get('/answersAll', this.dobaviSveOdgovore);
    this.router.post('/answerAdd', this.kreirajOdgovor);
    this.router.get('/answerGetId', authenticate, this.dobaviOdgovorPoId);
    this.router.get('/answersForQuestion', authenticate, this.dobaviOdgovoreZaPitanje);
    this.router.delete('/answerDelete', authenticate, this.obrisiOdgovor);
  }

  getRouter() {
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

      const noviOdgovor = await this.answerService.kreirajOdgovor(
        Number(pitanje_id),
        tekst_odgovora,
        Boolean(tacan)
      );

      if (noviOdgovor.id !== 0) {
        res.status(201).json({
          success: true,
          message: 'Odgovor uspešno kreiran',
          data: noviOdgovor,
        });
      } else {
        res.status(400).json({
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

      const odgovor = await this.answerService.dobaviOdgovorPoId(id);

      if (odgovor.id !== 0) {
        res.status(200).json(odgovor);
      } else {
        res.status(404).json({ message: 'Odgovor nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju odgovora po ID:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju odgovora' });
    }
  };

  private dobaviOdgovoreZaPitanje = async (req: Request, res: Response) => {
    try {
      const pitanje_id = Number(req.params.pitanje_id);

      if (isNaN(pitanje_id)) {
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

      const obrisano = await this.answerService.obrisiOdgovor(id);

      if (obrisano) {
        res.status(200).json({ success: true, message: 'Odgovor uspešno obrisan' });
      } else {
        res.status(404).json({ success: false, message: 'Odgovor nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri brisanju odgovora:', error);
      res.status(500).json({ message: 'Greška pri brisanju odgovora' });
    }
  };
}
