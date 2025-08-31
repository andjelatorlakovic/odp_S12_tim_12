import { Router, Request, Response } from 'express';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { QuestionService } from '../../Services/questions/QuestionService';

export class QuestionController {
  private router = Router();
  private questionService: QuestionService;

  constructor(questionService: QuestionService) {
    this.questionService = questionService;

    // Definisanje ruta sa autentifikacijom gde treba
    this.router.get('/questionsAll', authenticate, this.dobaviSvaPitanja);
    this.router.post('/questionAdd', this.kreirajPitanje);
    this.router.get('/questionGetId/:id', authenticate, this.dobaviPitanjePoId);
    this.router.get('/questionsForQuiz/:kviz_id', authenticate, this.dobaviPitanjaZaKviz);
    this.router.delete('/questionDelete/:id', authenticate, this.obrisiPitanje);
  }

  getRouter() {
    return this.router;
  }

  private dobaviSvaPitanja = async (req: Request, res: Response) => {
    try {
      const pitanja = await this.questionService.dobaviSvaPitanja();
      res.status(200).json(pitanja);
    } catch (error) {
      console.error('Greška pri dohvaćanju svih pitanja:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju svih pitanja' });
    }
  };

  private kreirajPitanje = async (req: Request, res: Response) => {
    try {
      const { kviz_id, tekst_pitanja } = req.body;

      const novoPitanje = await this.questionService.kreirajPitanje(Number(kviz_id), tekst_pitanja);

      if (novoPitanje.id !== 0) {
        res.status(201).json({
          success: true,
          message: 'Pitanje uspešno kreirano',
          data: novoPitanje,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Došlo je do greške prilikom kreiranja pitanja.',
        });
      }
    } catch (error) {
      console.error('Greška pri kreiranju pitanja:', error);
      res.status(500).json({ message: 'Greška pri kreiranju pitanja' });
    }
  };

  private dobaviPitanjePoId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const pitanje = await this.questionService.dobaviPitanjePoId(id);

      if (pitanje.id !== 0) {
        res.status(200).json(pitanje);
      } else {
        res.status(404).json({ message: 'Pitanje nije pronađeno' });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju pitanja po ID:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju pitanja' });
    }
  };

  private dobaviPitanjaZaKviz = async (req: Request, res: Response) => {
    try {
      const kviz_id = Number(req.params.kviz_id);

      if (isNaN(kviz_id)) {
        return res.status(400).json({ message: 'Neispravan ID kviza' });
      }

      const pitanja = await this.questionService.dobaviPitanjaZaKviz(kviz_id);
      res.status(200).json(pitanja);
    } catch (error) {
      console.error('Greška pri dohvatanju pitanja za kviz:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju pitanja za kviz' });
    }
  };

  private obrisiPitanje = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const obrisano = await this.questionService.obrisiPitanje(id);

      if (obrisano) {
        res.status(200).json({ success: true, message: 'Pitanje uspešno obrisano' });
      } else {
        res.status(404).json({ success: false, message: 'Pitanje nije pronađeno' });
      }
    } catch (error) {
      console.error('Greška pri brisanju pitanja:', error);
      res.status(500).json({ message: 'Greška pri brisanju pitanja' });
    }
  };
}
