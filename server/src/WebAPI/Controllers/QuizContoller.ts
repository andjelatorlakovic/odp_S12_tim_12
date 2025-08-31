import { Router, Request, Response } from 'express';

import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { KvizRepository } from '../../Domain/repositories/quiz/QuizRepository';
import { KvizService } from '../../Services/quiz/QuizService';
import { validacijaPodatakaKviz } from '../validators/quiz/QuizValidators';


export class KvizController {
  private router = Router();
  private kvizRepository = new KvizRepository();
  private kvizService: KvizService;

  constructor() {
    this.kvizService = new KvizService(this.kvizRepository);

    // Definiši rute i primeni autentifikaciju gde treba
    this.router.get('/kvizAll', authenticate, this.dobaviSveKvizove);
    this.router.post('/kvizAdd', authenticate, this.kreirajKviz); // Dodao sam authenticate za kreiranje
    this.router.get('/kvizGet/:id', authenticate, this.dobaviKvizPoId); // Dodao parametar :id u rutu
    this.router.get('/kvizGetNazJezNiv', authenticate, this.dobaviKvizPoNazivJezikNivo);
    this.router.delete('/kvizDelete/:id', authenticate, this.obrisiKviz); // Dodao parametar :id u rutu
  }

  getRouter() {
    return this.router;
  }

  private dobaviSveKvizove = async (req: Request, res: Response) => {
    try {
      const kvizovi = await this.kvizService.dobaviSveKvizove();
      res.status(200).json(kvizovi);
    } catch (error) {
      console.error('Greška pri dohvaćanju svih kvizova:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju svih kvizova' });
    }
  };

  private kreirajKviz = async (req: Request, res: Response) => {
    try {
      const { naziv_kviza, jezik, nivo_znanja } = req.body;

      // Poziv validacije
      const validacija = validacijaPodatakaKviz(naziv_kviza, jezik, nivo_znanja);
      if (!validacija.uspesno) {
        return res.status(400).json({ message: validacija.poruka });
      }

      // Kreiraj kviz preko servisa
      const noviKviz = await this.kvizService.kreirajKviz(naziv_kviza, jezik, nivo_znanja);

      if (noviKviz.id !== 0) {
        res.status(201).json({
          success: true,
          message: 'Kviz uspešno kreiran',
          data: noviKviz,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Došlo je do greške prilikom kreiranja kviza.',
        });
      }
    } catch (error) {
      console.error('Greška pri kreiranju kviza:', error);
      res.status(500).json({ message: 'Greška pri kreiranju kviza' });
    }
  };

  private dobaviKvizPoId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const kviz = await this.kvizService.dobaviKvizPoId(id);

      if (kviz.id !== 0) {
        res.status(200).json(kviz);
      } else {
        res.status(404).json({ message: 'Kviz nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju kviza po ID:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju kviza' });
    }
  };

  private dobaviKvizPoNazivJezikNivo = async (req: Request, res: Response) => {
    try {
      const { naziv_kviza, jezik, nivo_znanja } = req.query;

      if (
        typeof naziv_kviza !== 'string' ||
        typeof jezik !== 'string' ||
        typeof nivo_znanja !== 'string'
      ) {
        return res.status(400).json({ message: 'Nisu poslati validni parametri' });
      }

      const kviz = await this.kvizService.dobaviKvizPoNazivJezikNivo(
        naziv_kviza,
        jezik,
        nivo_znanja
      );

      if (kviz.id !== 0) {
        res.status(200).json(kviz);
      } else {
        res.status(404).json({ message: 'Kviz nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju kviza po naziv-jezik-nivo:', error);
      res.status(500).json({ message: 'Greška pri dohvatanju kviza' });
    }
  };

  private obrisiKviz = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const obrisano = await this.kvizService.obrisiKviz(id);

      if (obrisano) {
        res.status(200).json({ success: true, message: 'Kviz uspešno obrisan' });
      } else {
        res.status(404).json({ success: false, message: 'Kviz nije pronađen' });
      }
    } catch (error) {
      console.error('Greška pri brisanju kviza:', error);
      res.status(500).json({ message: 'Greška pri brisanju kviza' });
    }
  };
}
