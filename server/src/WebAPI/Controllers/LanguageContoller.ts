import { Router, Request, Response } from 'express';
import { LanguagesRepository } from '../../Domain/repositories/languages/LanguagesRepository';
import { LanguageService } from '../../Services/languages/LanguageService'; // Importujemo LanguageService
import { validacijaPodatakaAuth } from '../validators/languages/LanguageValidator'; // Importujemo funkciju za validaciju jezika
import { authenticate } from '../../Middlewares/autentification/AuthMiddleware';

export class LanguagesController {
  private router = Router();
  private languagesRepository = new LanguagesRepository();
  private languageService: LanguageService;

  constructor() {
    // Kreiramo instancu LanguageService sa zavisnošću LanguagesRepository
    this.languageService = new LanguageService(this.languagesRepository);

    // Postavljamo rute
    this.router.get('/languages',authenticate ,this.getLanguages);
    this.router.post('/languagesAdd',authenticate, this.dodajJezik); // Nova ruta za dodavanje jezika
  }

  getRouter() {
    return this.router;
  }

  // Ruta za dohvat svih jezika
  private getLanguages = async (req: Request, res: Response) => {
    try {
      const jezici = await this.languagesRepository.getAllLanguages();
      res.json(jezici);
    } catch (error) {
      console.error('Greška pri dohvaćanju jezika:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju jezika' });
    }
  };

  // Nova ruta za dodavanje jezika
  private dodajJezik = async (req: Request, res: Response) => {
    try {
      const { jezik } = req.body; // Koristi isto ime koje šalješ iz frontenda

      // Validacija podataka za jezik
      const validacija = validacijaPodatakaAuth(jezik);
      if (!validacija.uspesno) {
        return res.status(400).json({ message: validacija.poruka });
      }

      // Pozivamo servis za dodavanje jezika
      const noviJezik = await this.languageService.dodavanjeJezika(jezik);

      if (noviJezik.id !== 0) {
        // Vraćamo uspešan odgovor sa podacima o jeziku
        res.status(201).json({
          success: true,
          message: 'Jezik uspešno dodat',
          data: noviJezik,
        });
      } else {
        // Ako je jezik već postojao ili došlo je do greške
        res.status(400).json({
          success: false,
          message: 'Jezik već postoji ili došlo je do greške prilikom dodavanja.',
        });
      }
    } catch (error) {
      console.error('Greška pri dodavanju jezika:', error);
      res.status(500).json({ message: 'Greška pri dodavanju jezika.' });
    }
  };
}
