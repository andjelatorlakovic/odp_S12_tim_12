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
      const kreiranKviz = await this.kvizRepository.createKviz({
        id: 0, // ID se automatski generiše
        naziv_kviza,
        jezik,
        nivo_znanja
      });

      if (kreiranKviz.id !== 0) {
        return new QuizDto(kreiranKviz.id, kreiranKviz.naziv_kviza, kreiranKviz.jezik, kreiranKviz.nivo_znanja);
      }

      return new QuizDto(); // Prazan DTO ako nije uspešno
    } catch (error) {
      console.error("Greška prilikom kreiranja kviza:", error);
      throw new Error("Neuspešno kreiranje kviza.");
    }
  }

  async dobaviSveKvizove(): Promise<QuizDto[]> {
    try {
      const kvizovi = await this.kvizRepository.getAllKvizovi();
      return kvizovi.map(kviz =>
        new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja svih kvizova:", error);
      return [];
    }
  }

  async dobaviKvizPoId(id: number): Promise<QuizDto> {
    try {
      const kviz = await this.kvizRepository.getById(id);

      if (kviz.id !== 0) {
        return new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja);
      }

      return new QuizDto(); // Prazan DTO ako nije pronađen
    } catch (error) {
      console.error("Greška prilikom dobijanja kviza po ID-u:", error);
      return new QuizDto();
    }
  }

  async dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<QuizDto> {
    try {
      const kviz = await this.kvizRepository.getByNazivJezikNivo(naziv_kviza, jezik, nivo_znanja);

      if (kviz.id !== 0) {
        return new QuizDto(kviz.id, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja);
      }

      return new QuizDto(); // Prazan DTO ako nije pronađen
    } catch (error) {
      console.error("Greška prilikom dobijanja kviza po kombinaciji naziv-jezik-nivo:", error);
      return new QuizDto();
    }
  }

  async obrisiKviz(id: number): Promise<boolean> {
    try {
      return await this.kvizRepository.deleteById(id);
    } catch (error) {
      console.error("Greška prilikom brisanja kviza:", error);
      return false;
    }
  }
}
