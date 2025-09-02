import { Router, Request, Response } from 'express';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { UserQuizResultService } from '../../Services/userQuiz/UserQuizService';
import { validacijaPodatakaUserQuiz } from '../validators/userQuiz/UserQuizValidator';

export class UserQuizResultController {
  private router: Router;
  private userQuizResultService: UserQuizResultService;

  constructor(userQuizResultService: UserQuizResultService) {
    this.router = Router();
    this.userQuizResultService = userQuizResultService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/rezultati', authenticate, this.dobaviSveRezultate.bind(this));
    this.router.get('/rezultat', authenticate, this.dobaviRezultatPoUserIKviz.bind(this));
    this.router.get('/rezultatiUser', authenticate, this.dobaviRezultatePoUser.bind(this));
    this.router.get('/rezultatiKviz', authenticate, this.dobaviRezultatePoKviz.bind(this));
    this.router.post('/rezultat', authenticate, this.kreirajRezultat.bind(this));
    this.router.put('/azurirajProcenat', authenticate, this.azurirajProcenat.bind(this));
    this.router.delete('/obrisiRezultat', authenticate, this.obrisiRezultat.bind(this));

    // Nova ruta za dohvatanje kvizova sa procenat tacnih > 85 i brojem kvizova > 3
    this.router.get('/kvizoviPreko85SaBrojemVecimOdTri', this.dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  
  private async dobaviSveRezultate(req: Request, res: Response): Promise<void> {
    try {
      const rezultati = await this.userQuizResultService.dobaviSveRezultate();
      res.status(200).json({ success: true, data: rezultati });
    } catch (error) {
      console.error("Greška pri dohvatanju svih rezultata:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju svih rezultata" });
    }
  }

  private async dobaviRezultatPoUserIKviz(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.query.userId);
      const kvizId = Number(req.query.kvizId);

      if (isNaN(userId) || isNaN(kvizId)) {
        res.status(400).json({ success: false, message: "Nisu poslati validni parametri" });
        return;
      }

      const rezultat = await this.userQuizResultService.dobaviRezultatPoUserIKviz(userId, kvizId);
      if (rezultat) {
        res.status(200).json({ success: true, data: rezultat });
      } else {
        res.status(404).json({ success: false, message: "Rezultat nije pronađen" });
      }
    } catch (error) {
      console.error("Greška pri dohvatanju rezultata po korisniku i kvizu:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju rezultata" });
    }
  }

  private async dobaviRezultatePoUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.query.userId);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: "Nije poslat validan userId" });
        return;
      }

      const rezultati = await this.userQuizResultService.dobaviRezultatePoUser(userId);
      res.status(200).json({ success: true, data: rezultati });
    } catch (error) {
      console.error("Greška pri dohvatanju rezultata po korisniku:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju rezultata" });
    }
  }

  private async dobaviRezultatePoKviz(req: Request, res: Response): Promise<void> {
    try {
      const kvizId = Number(req.query.kvizId);
      if (isNaN(kvizId)) {
        res.status(400).json({ success: false, message: "Nije poslat validan kvizId" });
        return;
      }

      const rezultati = await this.userQuizResultService.dobaviRezultatePoKviz(kvizId);
      res.status(200).json({ success: true, data: rezultati });
    } catch (error) {
      console.error("Greška pri dohvatanju rezultata po kvizu:", error);
      res.status(500).json({ success: false, message: "Greška pri dohvatanju rezultata" });
    }
  }

  private async kreirajRezultat(req: Request, res: Response): Promise<void> {
    try {
      const { userId, kvizId, jezik, nivo, procenatTacnihOdgovora } = req.body;

      const validacija = validacijaPodatakaUserQuiz(userId, kvizId, jezik, nivo, procenatTacnihOdgovora);
      if (!validacija.uspesno) {
        res.status(400).json({ success: false, message: validacija.poruka });
        return;
      }

      const rezultat = await this.userQuizResultService.kreirajRezultat(userId, kvizId, jezik, nivo, procenatTacnihOdgovora);

      res.status(201).json({ success: true, data: rezultat, message: "Rezultat uspešno kreiran" });
    } catch (error) {
      console.error("Greška pri kreiranju rezultata:", error);
      res.status(500).json({ success: false, message: "Greška pri kreiranju rezultata" });
    }
  }

  private async obrisiRezultat(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.query.userId);
      const kvizId = Number(req.query.kvizId);

      if (isNaN(userId) || isNaN(kvizId)) {
        res.status(400).json({ success: false, message: "Nisu poslati validni parametri" });
        return;
      }

      const obrisano = await this.userQuizResultService.obrisiRezultat(userId, kvizId);
      if (obrisano) {
        res.status(200).json({ success: true, message: "Rezultat uspešno obrisan" });
      } else {
        res.status(404).json({ success: false, message: "Rezultat nije pronađen" });
      }
    } catch (error) {
      console.error("Greška pri brisanju rezultata:", error);
      res.status(500).json({ success: false, message: "Greška pri brisanju rezultata" });
    }
  }

  private async azurirajProcenat(req: Request, res: Response): Promise<void> {
    try {
      const { userId, kvizId, procenat } = req.body;

      if (typeof userId !== 'number' || typeof kvizId !== 'number' || typeof procenat !== 'number') {
        res.status(400).json({ success: false, message: "Nisu poslati validni parametri" });
        return;
      }

      const azurirano = await this.userQuizResultService.azurirajProcenat(userId, kvizId, procenat);
      if (azurirano) {
        res.status(200).json({ success: true, message: "Procenat uspešno ažuriran" });
      } else {
        res.status(404).json({ success: false, message: "Rezultat nije pronađen" });
      }
    } catch (error) {
      console.error("Greška pri ažuriranju procenta:", error);
      res.status(500).json({ success: false, message: "Greška pri ažuriranju procenta" });
    }
  }

  // NOVI METOD ZA DOBAVLJANJE KVIZOVA SA PROCENTOM PREKO 85 I BROJEM > 3
private async dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(req: Request, res: Response): Promise<void> {
  try {
    const rezultati = await this.userQuizResultService.dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri();
    res.status(200).json({ success: true, data: rezultati });
  } catch (error) {
    console.error("Greška pri dohvatanju kvizova sa procentom preko 85 i brojem većim od 3:", error);
    res.status(500).json({ success: false, message: "Greška pri dohvatanju kvizova" });
  }
}

}
