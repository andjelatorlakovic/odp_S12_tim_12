import { QuizDto } from "../../Domain/DTOs/quiz/QuizDto";
import { KvizRepository } from "../../Domain/repositories/quiz/QuizRepository";
import { IKvizService } from "../../Domain/services/quiz/IQuizService";

export class KvizService implements IKvizService {
  private kvizRepository: KvizRepository;

  constructor(kvizRepository: KvizRepository) {
    this.kvizRepository = kvizRepository;
  }

  async kreirajKviz(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<QuizDto> {
    try {
      const postoji = await this.kvizRepository.getByNazivJezikNivo(naziv_kviza, jezik, nivo_znanja);
      if (postoji.id !== 0) {
        return new QuizDto();
      }

      const kreiranKviz = await this.kvizRepository.createKviz({
        id: 0,
        naziv_kviza,
        jezik,
        nivo_znanja
      });

      if (kreiranKviz.id !== 0) {
        return new QuizDto(kreiranKviz.id, kreiranKviz.naziv_kviza, kreiranKviz.jezik, kreiranKviz.nivo_znanja);
      }

      return new QuizDto();
    } catch (error) {
      console.error("Greška prilikom kreiranja kviza:", error);
      return new QuizDto();
    }
  }

  async dobaviSveKvizove(): Promise<QuizDto[]> {
    try {
      const kvizovi = await this.kvizRepository.getAllKvizovi();
      if (!kvizovi || kvizovi.length === 0) return [];

      return kvizovi.map(kviz => new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja));
    } catch (error) {
      console.error("Greška prilikom dobijanja svih kvizova:", error);
      return [];
    }
  }

  async dobaviKvizPoId(id: number): Promise<QuizDto> {
    try {
      const kviz = await this.kvizRepository.getById(id);
      if (kviz.id !== 0) return new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja);

      return new QuizDto();
    } catch (error) {
      console.error("Greška prilikom dobijanja kviza po ID-u:", error);
      return new QuizDto();
    }
  }

  async dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<QuizDto> {
    try {
      const kviz = await this.kvizRepository.getByNazivJezikNivo(naziv_kviza, jezik, nivo_znanja);
      if (kviz.id !== 0) return new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja);

      return new QuizDto();
    } catch (error) {
      console.error("Greška prilikom dobijanja kviza po kombinaciji naziv-jezik-nivo:", error);
      return new QuizDto();
    }
  }

  // Nova funkcija: dobavlja kvizove koje korisnik još nije radio
  async dobaviKvizovePoJezikuINivou(userId: number, jezik: string, nivo_znanja: string): Promise<QuizDto[]> {
    try {
      const kvizovi = await this.kvizRepository.getAvailableForUser(userId, jezik, nivo_znanja);
      if (!kvizovi || kvizovi.length === 0) return [];

      return kvizovi.map(kviz => new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja));
    } catch (error) {
      console.error("Greška prilikom dobijanja kvizova po jeziku i nivou:", error);
      return [];
    }
  }

  async obrisiKviz(id: number): Promise<boolean> {
    try {
      const kviz = await this.kvizRepository.getById(id);
      if (kviz.id === 0) return false;

      return await this.kvizRepository.deleteById(id);
    } catch (error) {
      console.error("Greška prilikom brisanja kviza:", error);
      return false;
    }
  }
}
