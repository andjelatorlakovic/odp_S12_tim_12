import { IQuestionService } from "../../Domain/services/questions/IQuestionService";
import { QuestionRepository } from "../../Domain/repositories/questions/QuestionRepository";
import { QuestionDto } from "../../Domain/DTOs/questions/QuestionDto";

export class QuestionService implements IQuestionService {
  private questionRepository: QuestionRepository;

  constructor(questionRepository: QuestionRepository) {
    this.questionRepository = questionRepository;
  }

  async kreirajPitanje(kviz_id: number, tekst_pitanja: string): Promise<QuestionDto> {
    try {
      const kreiranoPitanje = await this.questionRepository.createQuestion({
        id: 0, // ID se automatski generiše u bazi
        kviz_id,
        tekst_pitanja,
      });

      if (kreiranoPitanje.id !== 0) {
        return new QuestionDto(kreiranoPitanje.id, kreiranoPitanje.kviz_id, kreiranoPitanje.tekst_pitanja);
      }

      return new QuestionDto(); // Prazan DTO ako nije uspešno kreirano pitanje
    } catch (error) {
      console.error("Greška prilikom kreiranja pitanja:", error);
      throw new Error("Neuspešno kreiranje pitanja.");
    }
  }

  async dobaviSvaPitanja(): Promise<QuestionDto[]> {
    try {
      const pitanja = await this.questionRepository.getAllQuestions();
      return pitanja.map(pitanje =>
        new QuestionDto(pitanje.id, pitanje.kviz_id, pitanje.tekst_pitanja)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja svih pitanja:", error);
      return [];
    }
  }

  async dobaviPitanjaZaKviz(kviz_id: number): Promise<QuestionDto[]> {
    try {
      const pitanja = await this.questionRepository.getQuestionsByKvizId(kviz_id);
      return pitanja.map(pitanje =>
        new QuestionDto(pitanje.id, pitanje.kviz_id, pitanje.tekst_pitanja)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja pitanja za kviz:", error);
      return [];
    }
  }

  async dobaviPitanjePoId(id: number): Promise<QuestionDto> {
    try {
      const pitanje = await this.questionRepository.getById(id);

      if (pitanje && pitanje.id !== 0) {
        return new QuestionDto(pitanje.id, pitanje.kviz_id, pitanje.tekst_pitanja);
      }

      return new QuestionDto(); // Prazan DTO ako nije pronađeno pitanje
    } catch (error) {
      console.error("Greška prilikom dobijanja pitanja po ID-u:", error);
      return new QuestionDto();
    }
  }

  async obrisiPitanje(id: number): Promise<boolean> {
    try {
      return await this.questionRepository.deleteById(id);
    } catch (error) {
      console.error("Greška prilikom brisanja pitanja:", error);
      return false;
    }
  }
}
