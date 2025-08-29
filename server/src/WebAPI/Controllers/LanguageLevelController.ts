import { Router, Request, Response } from 'express';
import { LanguageLevelRepository } from '../../Domain/repositories/languageLevels/LanguageLevelRepository';
import { LanguageLevelService } from '../../Services/languageLevels/LanguageLevelService';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';


export class LanguageLevelController {
  private router = Router();
  private languageLevelRepository = new LanguageLevelRepository();
  private languageLevelService: LanguageLevelService;

  constructor() {
    this.languageLevelService = new LanguageLevelService(this.languageLevelRepository);

    // Postavljamo rute sa middleware-om
    this.router.get('/languageLevels', authenticate, this.getLanguageLevels);
    this.router.post('/addLanguageLevel', authenticate, this.dodajLanguageLevel);
  }

  getRouter() {
    return this.router;
  }

  private getLanguageLevels = async (req: Request, res: Response) => {
    try {
      const languageLevels = await this.languageLevelRepository.getAllLanguageLevels();
      res.json(languageLevels);
    } catch (error) {
      console.error('Greška pri dohvaćanju jezik-nivo parova:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju jezik-nivo parova' });
    }
  };

  private dodajLanguageLevel = async (req: Request, res: Response) => {
    try {
      const { jezik, naziv } = req.body;

      const noviLanguageLevel = await this.languageLevelService.dodavanjeLanguageLevel(jezik, naziv);

      if (noviLanguageLevel.jezik !== "") {
        res.status(201).json({
          success: true,
          message: 'Jezik-nivo par uspešno dodat',
          data: { noviLanguageLevel }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Došlo je do greške prilikom dodavanja jezik-nivo para.'
        });
      }
    } catch (error) {
      console.error('Greška pri dodavanju jezik-nivo para:', error);
      res.status(500).json({ message: 'Greška pri dodavanju jezik-nivo para.' });
    }
  };
}
