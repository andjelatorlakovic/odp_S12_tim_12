import { Router, Request, Response } from 'express';
import { LanguagesRepository } from '../../Domain/repositories/languages/LanguagesRepository';

export class LanguagesController {
  private router = Router();
  private languagesRepository = new LanguagesRepository();

  constructor() {
    this.router.get('/languages', this.getLanguages);
    this.router.post('/languages', this.addLanguage);
  }

  getRouter() {
    return this.router;
  }
private addLanguage = async (req: Request, res: Response) => {
  try {
    const { jezik } = req.body; // koristi isto ime koje šalješ iz frontenda
    if (!jezik) {
      return res.status(400).json({ message: 'Nedostaje naziv jezika.' });
    }
    const novi = await this.languagesRepository.createLanguage(jezik);
    res.status(201).json(novi);
  } catch (error) {
    console.error('Greška pri dodavanju jezika:', error);
    res.status(500).json({ message: 'Greška pri dodavanju jezika.' });
  }
};


  private getLanguages = async (req: Request, res: Response) => {
    try {
      const jezici = await this.languagesRepository.getAllLanguages();
      res.json(jezici);
    } catch (error) {
      console.error('Greška pri dohvaćanju jezika:', error);
      res.status(500).json({ message: 'Greška pri dohvaćanju jezika' });
    }
  };
}
