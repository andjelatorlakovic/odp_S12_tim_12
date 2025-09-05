import { Router, Request, Response } from 'express';
import { validacijaPodatakaKviz } from '../validators/quiz/QuizValidators';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { IKvizService } from '../../Domain/services/quiz/IQuizService';

export class KvizController {
  private router: Router;
  private kvizService: IKvizService;

  constructor(kvizService: IKvizService) {
    this.router = Router();
    this.kvizService = kvizService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/kviz/Svi', authenticate, this.dobaviSveKvizove.bind(this));
    this.router.get('/kviz/Id', authenticate, this.dobaviKvizPoId.bind(this));
    this.router.get('/kviz/Pretraga', authenticate, this.dobaviKvizPoNazivJezikNivo.bind(this));
    this.router.get('/kviz/Filter', authenticate, this.dobaviKvizovePoJezikuINivou.bind(this));
    this.router.post('/kviz/Kreiraj', authenticate, this.kreirajKviz.bind(this));
    this.router.delete('/kviz/Obrisi', authenticate, this.obrisiKviz.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async dobaviSveKvizove(req: Request, res: Response): Promise<void> {
    try {
      const kvizovi = await this.kvizService.dobaviSveKvizove();
      res.status(200).json({ success: true, data: kvizovi });
    } catch (error) {
      console.error("Greška pri dohvatanju svih kvizova:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju svih kvizova" });
    }
  }

  private async dobaviKvizPoId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.query.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Nije prosleđen validan ID.' });
        return;
      }

      const kviz = await this.kvizService.dobaviKvizPoId(id);

      if (kviz.id !== 0) {
        res.status(200).json({ success: true, data: kviz });
      } else {
        res.status(404).json({ success: false, message: 'Kviz nije pronađen' });
      }
    } catch (error) {
      console.error("Greška pri dohvatanju kviza po ID-u:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju kviza" });
    }
  }

  private async dobaviKvizPoNazivJezikNivo(req: Request, res: Response): Promise<void> {
    try {
      const { naziv_kviza, jezik, nivo_znanja } = req.query;

      if (typeof naziv_kviza !== 'string' || typeof jezik !== 'string' || typeof nivo_znanja !== 'string') {
        res.status(400).json({ success: false, message: 'Nisu poslati validni parametri' });
        return;
      }

      const kviz = await this.kvizService.dobaviKvizPoNazivJezikNivo(naziv_kviza, jezik, nivo_znanja);

      if (kviz.id !== 0) {
        res.status(200).json({ success: true, data: kviz });
      } else {
        res.status(404).json({ success: false, message: 'Kviz nije pronađen' });
      }
    } catch (error) {
      console.error("Greška pri dohvatanju kviza po naziv-jezik-nivo:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju kviza" });
    }
  }

  private async dobaviKvizovePoJezikuINivou(req: Request, res: Response): Promise<void> {
    try {
      const { jezik, nivo_znanja } = req.query;

      if (typeof jezik !== 'string' || typeof nivo_znanja !== 'string') {
        res.status(400).json({ success: false, message: 'Nisu prosleđeni validni parametri.' });
        return;
      }

      // Dohvatamo userId iz authenticate middleware-a
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Korisnik nije autentifikovan.' });
        return;
      }

      const kvizovi = await this.kvizService.dobaviKvizovePoJezikuINivou(userId, jezik, nivo_znanja);
      res.status(200).json({ success: true, data: kvizovi });
    } catch (error) {
      console.error("Greška pri filtriranju kvizova po jeziku i nivou:", error);
      res.status(500).json({ success: false, message: "Greška pri filtriranju kvizova" });
    }
  }

  private async kreirajKviz(req: Request, res: Response): Promise<void> {
    try {
      const { naziv_kviza, jezik, nivo_znanja } = req.body;

      const validacija = validacijaPodatakaKviz(naziv_kviza, jezik, nivo_znanja);
      if (!validacija.uspesno) {
        res.status(400).json({ success: false, message: validacija.poruka });
        return;
      }

      const noviKviz = await this.kvizService.kreirajKviz(naziv_kviza, jezik, nivo_znanja);

      if (noviKviz.id !== 0) {
        res.status(201).json({ success: true, message: 'Kviz uspešno kreiran', data: noviKviz });
      } else {
        res.status(400).json({ success: false, message: 'Kviz sa datim parametrima već postoji ili nije uspešno kreiran.' });
      }
    } catch (error) {
      console.error("Greška pri kreiranju kviza:", error);
      res.status(500).json({ success: false, message: "Greška pri kreiranju kviza" });
    }
  }

  private async obrisiKviz(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.query.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Nije prosleđen validan ID.' });
        return;
      }

      const rezultat = await this.kvizService.obrisiKviz(id);

      if (rezultat) {
        res.status(200).json({ success: true, message: "Kviz uspešno obrisan" });
      } else {
        res.status(404).json({ success: false, message: "Kviz nije pronađen" });
      }
    } catch (error) {
      console.error("Greška pri brisanju kviza:", error);
      res.status(500).json({ success: false, message: "Greška pri brisanju kviza" });
    }
  }
}
