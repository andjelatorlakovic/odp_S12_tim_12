import { Router, Request, Response } from 'express';

import { UserLanguageLevelService } from '../../Services/userLanguages/UserLanguageService';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
export class UserLanguageLevelController {
  private router = Router();
  private userLanguageLevelService: UserLanguageLevelService;

  constructor(userLanguageLevelService: UserLanguageLevelService) {
    this.userLanguageLevelService = userLanguageLevelService;

    // Test ruta za proveru
    this.router.get('/test', (req, res) => {
      res.json({ msg: 'Radi!' });
    });

    // Postavljamo rute
    this.router.post('/userLanguagesAdd',authenticate, this.createUserLanguageLevel);
    this.router.get('/userLanguagesMissing',authenticate, this.getLanguagesUserDoesNotHave);
    this.router.get('/userLanguageByUserAndLanguage',authenticate, this.getByUserAndLanguage);
    this.router.get('/userLanguageByUserLanguageAndLevel',authenticate, this.getByUserLanguageAndLevel);
    this.router.put('/updateKrajNivoa',authenticate, this.updateKrajNivoa);
    this.router.get('/userLanguagesFinished',authenticate, this.getFinishedLevelsByUsername);
  }

  getRouter() {
    return this.router;
  }
  private updateKrajNivoa = async (req: Request, res: Response) => {
    try {
      const { userId, jezik, nivo } = req.body;

      if (!userId || !jezik || !nivo) {
        return res.status(400).json({ success: false, message: 'Nisu prosleđeni svi potrebni parametri.' });
      }

      const updated = await this.userLanguageLevelService.updateKrajNivoa(userId, jezik, nivo);

      if (updated) {
        res.status(200).json({ success: true, message: 'Datum krajNivoa uspešno ažuriran.' });
      } else {
        res.status(404).json({ success: false, message: 'Nije pronađen zapis za ažuriranje.' });
      }
    } catch (error) {
      console.error('Greška pri ažuriranju datuma krajNivoa:', error);
      res.status(500).json({ success: false, message: 'Greška pri ažuriranju datuma krajNivoa.' });
    }
  };
  private createUserLanguageLevel = async (req: Request, res: Response) => {
    try {
      const { userId, jezik, nivo } = req.body;

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

  private getLanguagesUserDoesNotHave = async (req: Request, res: Response) => {
    try {
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

  private getByUserAndLanguage = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      const jezik = req.query.jezik as string;

      if (!userId || !jezik) {
        return res.status(400).json({ success: false, message: "Nisu prosleđeni validni parametri" });
      }

      const userLang = await this.userLanguageLevelService.getByUserAndLanguage(userId, jezik);

      if (userLang.userId !== 0) {
        res.status(200).json({ success: true, data: userLang });
      } else {
        res.status(404).json({ success: false, message: "Jezik nije pronađen za korisnika" });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju jezika korisnika:', error);
      res.status(500).json({ success: false, message: 'Greška pri dohvatanju jezika korisnika.' });
    }
  };

  private getByUserLanguageAndLevel = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      const jezik = req.query.jezik as string;
      const nivo = req.query.nivo as string;

      if (!userId || !jezik || !nivo) {
        return res.status(400).json({ success: false, message: "Nisu prosleđeni validni parametri" });
      }

      const level = await this.userLanguageLevelService.getByUserLanguageAndLevel(userId, jezik, nivo);

      if (level.userId !== 0) {
        res.status(200).json({ success: true, data: level });
      } else {
        res.status(404).json({ success: false, message: "Nivo jezika nije pronađen za korisnika" });
      }
    } catch (error) {
      console.error('Greška pri dohvatanju nivoa jezika korisnika:', error);
      res.status(500).json({ success: false, message: 'Greška pri dohvatanju nivoa jezika korisnika.' });
    }
  };
  private getFinishedLevelsByUsername = async (req: Request, res: Response) => {
  try {
    const korIme = req.query.korIme as string;

    if (!korIme || korIme.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Nije prosleđeno korisničko ime.",
      });
    }

    const levels = await this.userLanguageLevelService.getFinishedLevelsByUsername(korIme);

    // Ako je vraćen samo jedan prazan DTO (npr. [new FinishedLanguageLevelDto()])
    const isEmpty = levels.length === 1 && levels[0].korisnickoIme === "";

    if (isEmpty) {
      return res.status(404).json({
        success: false,
        message: "Nema završenih nivoa za datog korisnika.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: levels,
    });
  } catch (error) {
    console.error("Greška pri dohvatanju završenih nivoa:", error);
    res.status(500).json({
      success: false,
      message: "Greška pri dohvatanju završenih nivoa korisnika.",
    });
  }
};

}
