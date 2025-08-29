import { Router, Request, Response } from 'express';
import { LanguageLevelRepository } from '../../Domain/repositories/languageLevels/LanguageLevelRepository';
import { LanguageLevelService } from '../../Services/languageLevels/LanguageLevelService';

export class LanguageLevelController {
  private router = Router();
  private languageLevelRepository = new LanguageLevelRepository();
  private languageLevelService: LanguageLevelService;

  constructor() {
    // Kreiramo instancu LanguageLevelService sa zavisnošću LanguageLevelRepository
    this.languageLevelService = new LanguageLevelService(this.languageLevelRepository); // Prosleđivanje repo-a

    // Postavljamo rute
    this.router.get('/languageLevels', this.getLanguageLevels);
    this.router.post('/addLanguageLevel', this.dodajLanguageLevel); // Nova ruta za dodavanje jezik-nivo para
  }

  getRouter() {
    return this.router;
  }

  // Ruta za dohvat svih jezik-nivo parova
  private getLanguageLevels = async (req: Request, res: Response) => {
    try {
      const languageLevels = await this.languageLevelRepository.getAllLanguageLevels();
      res.json(languageLevels);
    } catch (error) {
      console.error('Greška pri dohvaćanju jezik-nivo parova:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju jezik-nivo parova' });
    }
  };

  // Nova ruta za dodavanje jezik-nivo para
  private dodajLanguageLevel = async (req: Request, res: Response) => {
    try {
      const { jezik, naziv } = req.body; 

      // Pozivamo servis za dodavanje jezik-nivo para
      const noviLanguageLevel = await this.languageLevelService.dodavanjeLanguageLevel(jezik, naziv);

      if (noviLanguageLevel.jezik!=="") {
        // Vraćamo uspešan odgovor sa podacima o jezik-nivo paru
        res.status(201).json({
          success: true,
          message: 'Jezik-nivo par uspešno dodat',
         data: {
          noviLanguageLevel,
        }
        });
      } else {
        // Ako dođe do greške prilikom dodavanja
        res.status(400).json({
          success: false,
          message: 'Došlo je do greške prilikom dodavanja jezik-nivo para.',
        });
      }
    } catch (error) {
      console.error('Greška pri dodavanju jezik-nivo para:', error);
      res.status(500).json({ message: 'Greška pri dodavanju jezik-nivo para.' });
    }
  };
}
