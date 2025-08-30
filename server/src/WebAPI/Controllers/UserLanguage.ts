import { Router, Request, Response } from 'express';
import { IUserLanguageLevelService } from '../../Domain/services/userLanguage/IUserLanguageService';

import { UserLanguageLevelDto } from '../../Domain/DTOs/userLanguage/UserLanguageDto';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware'; // ako koristis auth middleware
import { UserLanguageLevelRepository } from '../../Domain/repositories/userLanguage/UserLanguageRepository';
import { UserLanguageLevelService } from '../../Services/userLanguages/UserLanguageService';

export class UserLanguageLevelController {
  private router = Router();
  private userLangLevelService: IUserLanguageLevelService;
    userLangLevelRepository: any;

  constructor() {
    const repo = new UserLanguageLevelRepository();
    this.userLangLevelService = new UserLanguageLevelService(repo);

    // Rute
    this.router.get('/getUserLanguageLevel', this.getUserLanguageLevel);
    this.router.get('/getAllUserLanguageLevel', this.getAllUserLanguageLevels);
    this.router.post('/postUserLanguageLevel', this.addUserLanguageLevel);
    this.router.put('/putUserLanguageLevel', this.updateUserLanguageLevel);
    this.router.delete('/deleteUserLanguageLevel', this.deleteUserLanguageLevel);
  }

  getRouter() {
    return this.router;
  }

  private getUserLanguageLevel = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const jezik = req.params.jezik;

      const result = await this.userLangLevelService.getUserLanguageLevel(userId, jezik);
      if (result.userId === 0) {
        return res.status(404).json({ message: 'Nije pronađen nivo jezika za ovog korisnika.' });
      }
      res.json(result);
    } catch (error) {
      console.error('Greška pri dohvaćanju nivoa jezika:', error);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  };

  private getAllUserLanguageLevels = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const results = await this.userLangLevelService.getAllUserLanguageLevels(userId);
      res.json(results);
    } catch (error) {
      console.error('Greška pri dohvaćanju svih nivoa jezika:', error);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  };

  private addUserLanguageLevel = async (req: Request, res: Response) => {
    try {
      const dto = req.body as UserLanguageLevelDto;
      const created = await this.userLangLevelRepository.createUserLanguageLevel(dto);

      if (created.userId === 0) {
        return res.status(400).json({ message: 'Korisnik već ima ovaj jezik sa nivoom.' });
      }

      res.status(201).json({
        success: true,
        message: 'Jezik i nivo uspešno dodati.',
        data: { created},
      });
    } catch (error) {
      console.error('Greška pri dodavanju nivoa jezika:', error);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  };

  private updateUserLanguageLevel = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const jezik = req.params.jezik;
      const { nivo } = req.body;

      const updated = await this.userLangLevelService.updateUserLanguageLevel(userId, jezik, nivo);

      if (updated.userId === 0) {
        return res.status(404).json({ message: 'Nije pronađen nivo jezika za ažuriranje.' });
      }

      res.json({
        success: true,
        message: 'Nivo jezika uspešno ažuriran.',
        data: updated,
      });
    } catch (error) {
      console.error('Greška pri ažuriranju nivoa jezika:', error);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  };

  private deleteUserLanguageLevel = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const jezik = req.params.jezik;

      await this.userLangLevelService.deleteUserLanguageLevel(userId, jezik);

      res.status(204).send();
    } catch (error) {
      console.error('Greška pri brisanju nivoa jezika:', error);
      res.status(500).json({ message: 'Greška na serveru.' });
    }
  };
}
