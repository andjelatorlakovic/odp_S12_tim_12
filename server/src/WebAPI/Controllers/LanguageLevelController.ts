import { Router, Request, Response } from 'express';
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';
import { RezultatValidacije } from '../../Domain/types/ValidationResult';
import { validacijaPodatakaJezikNivo } from '../validators/languageLevel/LanguageLevelValidator';
import { ILanguageLevelService } from '../../Domain/services/languageLevel/ILanguageLevelService';


export class LanguageLevelController {
  private router: Router;
  private languageLevelService: ILanguageLevelService;

  constructor(languageLevelService: ILanguageLevelService) {
    this.router = Router();
    this.languageLevelService = languageLevelService;
    this.initializeRoutes();
  }

    private initializeRoutes(): void {
    this.router.get('/languageLevel/Get', authenticate, this.getLanguageLevels);
    this.router.post('/languageLevel/Add', authenticate, this.dodajLanguageLevel);
    this.router.get('/languageLevel/With', this.getLanguagesWithLevels);
    this.router.get('/languageLevel/levels', authenticate, this.getLevelsByLanguage);
  }

  public getRouter(): Router {
    return this.router;
  }

  private getLanguageLevels = async (req: Request, res: Response) => {
    try {
      const languageLevels = await this.languageLevelService.getLanguagesWithLevels();
      res.json(languageLevels);
    } catch (error) {
      console.error('Greška pri dohvaćanju jezik-nivo parova:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju jezik-nivo parova' });
    }
  };

  private getLanguagesWithLevels = async (req: Request, res: Response) => {
    try {
      const data = await this.languageLevelService.getLanguagesWithLevels();
      res.status(200).json(data);
    } catch (error) {
      console.error('Greška pri učitavanju jezika sa nivoima:', error);
      res.status(500).json({ message: "Greška pri učitavanju jezika sa nivoima" });
    }
  };

  private dodajLanguageLevel = async (req: Request, res: Response) => {
    try {
      const { jezik, naziv } = req.body;

      // ➕ Validacija podataka
      const rezultatValidacije: RezultatValidacije = validacijaPodatakaJezikNivo(jezik, naziv);
      if (!rezultatValidacije.uspesno) {
        return res.status(400).json({
          success: false,
          message: rezultatValidacije.poruka
        });
      }

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

  private getLevelsByLanguage = async (req: Request, res: Response) => {
    const jezik = req.query.jezik as string;

    if (!jezik) {
      return res.status(400).json({ message: "Jezik nije prosleđen." });
    }

    try {
      const languageLevelsDto = await this.languageLevelService.getLevelsByLanguage(jezik);

      res.status(200).json({
        jezik,
        nivoi: languageLevelsDto.nivoi
      });
    } catch (error) {
      console.error("Greška pri dohvaćanju nivoa za jezik:", error);
      res.status(500).json({ message: "Greška pri dohvaćanju nivoa za dati jezik." });
    }
  };
}
