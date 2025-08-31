import { Router, Request, Response } from 'express';

import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { UserLanguageLevelRepository } from '../../Domain/repositories/userLanguage/UserLanguageRepository';
import { UserLanguageLevelService } from '../../Services/userLanguages/UserLanguageService';

export class UserLanguageLevelController {
  private router = Router();
  private userLanguageLevelRepository = new UserLanguageLevelRepository();
  private userLanguageLevelService: UserLanguageLevelService;

  constructor() {
    // Kreiramo instancu servisa sa zavisnošću repozitorijuma
    this.userLanguageLevelService = new UserLanguageLevelService(this.userLanguageLevelRepository);

    // Postavljamo rute
    this.router.post('/userLanguagesAdd', this.createUserLanguageLevel);

    // Nova ruta za jezike koje korisnik nema
    this.router.get('/userLanguagesMissing', authenticate, this.getLanguagesUserDoesNotHave);
  }

  getRouter() {
    return this.router;
  }

  // Dodavanje jezika i nivoa korisniku
  private createUserLanguageLevel = async (req: Request, res: Response) => {
    try {
      const { userId, jezik, nivo } = req.body;

      // Poziv servisa koji ce da doda jezik i nivo ako nije već dodat
      const noviLevel = await this.userLanguageLevelService.createUserLanguageLevel(userId, jezik, nivo);

      if (noviLevel.userId !== 0) {
        res.status(201).json({
          success: true,
          message: 'Jezik i nivo uspešno dodat korisniku',
          data: noviLevel,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Korisnik već ima taj jezik ili došlo je do greške.',
        });
      }
    } catch (error) {
      console.error('Greška pri dodavanju jezika korisniku:', error);
      res.status(500).json({ message: 'Greška pri dodavanju jezika korisniku.' });
    }
  };

  // Nova metoda za dohvatanje jezika koje korisnik nema
  private getLanguagesUserDoesNotHave = async (req: Request, res: Response) => {
    try {
      // Pretpostavimo da userId dolazi iz query parametra (npr. /userLanguagesMissing?userId=1)
      const userId = Number(req.query.userId);
      if (!userId) {
        return res.status(400).json({ success: false, message: "Nije prosleđen validan userId" });
      }

      const jezici = await this.userLanguageLevelService.getLanguagesUserDoesNotHave(userId);

      res.status(200).json({
        success: true,
        data: jezici,
      });
    } catch (error) {
      console.error('Greška pri dohvatanju jezika koje korisnik nema:', error);
      res.status(500).json({ success: false, message: 'Greška pri dohvatanju jezika.' });
    }
  };
}
