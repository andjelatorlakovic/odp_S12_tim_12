import { Router, Request, Response } from 'express';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { validacijaPodatakaPitanja } from '../validators/questions/QuestionsValidator';
import { IQuestionService } from '../../Domain/services/questions/IQuestionService';
  // Importuj validaciju

export class QuestionController {
  private router: Router;
  private questionService: IQuestionService;

  constructor(questionService: IQuestionService) {
    this.router = Router();
    this.questionService = questionService;
    this.initializeRoutes();
  }

    private initializeRoutes(): void {
    this.router.get('/question/All', authenticate, this.dobaviSvaPitanja);
    this.router.post('/question/Add', authenticate, this.kreirajPitanje);  // Dodaj autentifikaciju
    this.router.get('/question/GetId/:id', authenticate, this.dobaviPitanjePoId);
    this.router.get('/question/ForQuiz/:kviz_id', authenticate, this.dobaviPitanjaZaKviz);
    this.router.delete('/question/Delete/:id', authenticate, this.obrisiPitanje);
  }

  public getRouter(): Router {
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

      // Validacija kviz_id
      if (!kviz_id || isNaN(Number(kviz_id)) || Number(kviz_id) <= 0) {
        return res.status(400).json({ success: false, message: 'Неисправан ID квиза.' });
      }

      // Validacija tekst_pitanja
      const validacija = validacijaPodatakaPitanja(tekst_pitanja); // Pozivanje validacije
      if (!validacija.uspesno) {
        return res.status(400).json({ success: false, message: validacija.poruka });
      }

      // Kreiranje pitanja
      const novoPitanje = await this.questionService.kreirajPitanje(Number(kviz_id), tekst_pitanja);

      if (novoPitanje.id !== 0) {
        return res.status(201).json({
          success: true,
          message: 'Питање успешно креирано.',
          data: novoPitanje,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Дошло је до грешке приликом креирања питања.',
        });
      }
    } catch (error) {
      console.error('Грешка при креирању питања:', error);
      res.status(500).json({ message: 'Грешка при креирању питања' });
    }
  };

  private dobaviPitanjePoId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const pitanje = await this.questionService.dobaviPitanjePoId(id);

      if (pitanje.id !== 0) {
        return res.status(200).json(pitanje);
      } else {
        return res.status(404).json({ message: 'Питање није пронађено' });
      }
    } catch (error) {
      console.error('Грешка при дохавању питања по ID:', error);
      res.status(500).json({ message: 'Грешка при дохавању питања' });
    }
  };

  private dobaviPitanjaZaKviz = async (req: Request, res: Response) => {
    try {
      const kviz_id = Number(req.params.kviz_id);

      if (isNaN(kviz_id)) {
        return res.status(400).json({ message: 'Неисправан ID квиза' });
      }

      const pitanja = await this.questionService.dobaviPitanjaZaKviz(kviz_id);
      res.status(200).json(pitanja);
    } catch (error) {
      console.error('Грешка при дохавању питања за квиз:', error);
      res.status(500).json({ message: 'Грешка при дохавању питања за квиз' });
    }
  };

  private obrisiPitanje = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const obrisano = await this.questionService.obrisiPitanje(id);

      if (obrisano) {
        res.status(200).json({ success: true, message: 'Питање успешно обрисано' });
      } else {
        res.status(404).json({ success: false, message: 'Питање није пронађено' });
      }
    } catch (error) {
      console.error('Грешка при брисању питања:', error);
      res.status(500).json({ message: 'Грешка при брисању питања' });
    }
  };
}
