import { IAnswerRepository } from "../../Database/repositories/answer/IAnswerRepository";
import { AnswerDto } from "../../Domain/DTOs/answers/AnswerDto";
import { Answer } from "../../Domain/models/Answer";
import { IAnswerService } from "../../Domain/services/answers/IAnswerService";

export class AnswerService implements IAnswerService {


  constructor(private answerRepository: IAnswerRepository) {
  }

  async kreirajOdgovor(pitanje_id: number, tekst_odgovora: string, tacan: boolean): Promise<AnswerDto> {
    // Možeš dodati proveru da li već postoji isti odgovor na pitanje ako želiš (po potrebi)

    const noviAnswer = new Answer(0, pitanje_id, tekst_odgovora, tacan);
    const kreiraniAnswer = await this.answerRepository.createAnswer(noviAnswer);

    if (kreiraniAnswer.id !== 0) {
      return new AnswerDto(
        kreiraniAnswer.id,
        kreiraniAnswer.pitanje_id,
        kreiraniAnswer.tekst_odgovora,
        kreiraniAnswer.tacan
      );
    }

    // Ako nije uspešno kreirano, vraćamo prazan DTO
    return new AnswerDto();
  }

  async dobaviSveOdgovore(): Promise<AnswerDto[]> {
    const odgovori = await this.answerRepository.getAllAnswers();

    return odgovori.map(o => new AnswerDto(o.id, o.pitanje_id, o.tekst_odgovora, o.tacan));
  }

  async dobaviOdgovoreZaPitanje(pitanje_id: number): Promise<AnswerDto[]> {
    const odgovori = await this.answerRepository.getAnswersByPitanjeId(pitanje_id);

    return odgovori.map(o => new AnswerDto(o.id, o.pitanje_id, o.tekst_odgovora, o.tacan));
  }

  async dobaviOdgovorPoId(id: number): Promise<AnswerDto> {
    const odgovor = await this.answerRepository.getById(id);

    if (odgovor) {
      return new AnswerDto(odgovor.id, odgovor.pitanje_id, odgovor.tekst_odgovora, odgovor.tacan);
    }

    return new AnswerDto();
  }

  async obrisiOdgovor(id: number): Promise<boolean> {
    return await this.answerRepository.deleteById(id);
  }
}
