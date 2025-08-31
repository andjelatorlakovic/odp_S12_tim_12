import { Router, Request, Response } from 'express';

import { validacijaPodatakaKviz } from '../validators/quiz/QuizValidators';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { KvizService } from '../../Services/quiz/QuizService';

export class KvizController {
  private router: Router;
  private kvizService: KvizService;

  constructor(kvizService: KvizService) {
    this.router = Router();
    this.kvizService = kvizService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/kviz', authenticate, this.dobaviSveKvizove.bind(this));
    this.router.get('/kvizId', authenticate, this.dobaviKvizPoId.bind(this));
    this.router.get('/kvizPretraga', authenticate, this.dobaviKvizPoNazivJezikNivo.bind(this));
    this.router.get('/kvizFilter', authenticate, this.dobaviKvizovePoJezikuINivou.bind(this));
    this.router.post('/kviz', authenticate, this.kreirajKviz.bind(this));
    this.router.delete('/kvizObrisi', authenticate, this.obrisiKviz.bind(this));
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
      const id = Number(req.params.id);
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

      const kvizovi = await this.kvizService.dobaviKvizovePoJezikuINivou(jezik, nivo_znanja);
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
      const id = Number(req.params.id);
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
