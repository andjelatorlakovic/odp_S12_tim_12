import { Answer } from "../../../Domain/models/Answer";


export interface IAnswerRepository {
  getAllAnswers(): Promise<Answer[]>;
  getAnswersByPitanjeId(pitanjeId: number): Promise<Answer[]>;
  getById(id: number): Promise<Answer | null>;
  createAnswer(answer: Answer): Promise<Answer>;
  deleteById(id: number): Promise<boolean>;
}
