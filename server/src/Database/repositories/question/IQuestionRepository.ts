import { Question } from "../../../Domain/models/Question";

export interface IQuestionRepository {
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByKvizId(kvizId: number): Promise<Question[]>;
  getById(id: number): Promise<Question | null>;
  createQuestion(question: Question): Promise<Question>;
  deleteById(id: number): Promise<boolean>;
}
