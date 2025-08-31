import { Question } from '../../../Domain/models/Question';
import db from '../../../Database/connection/DbConnectionPool';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IQuestionRepository } from '../../../Database/repositories/question/IQuestionRepository';


export class QuestionRepository implements IQuestionRepository {
  async getAllQuestions(): Promise<Question[]> {
    try {
      const query = `SELECT * FROM questions`;
      const [rows] = await db.query<RowDataPacket[]>(query);

      return rows.map(row => new Question(row.id, row.kviz_id, row.tekst_pitanja));
    } catch (error) {
      console.error("Error fetching all questions:", error);
      return [];
    }
  }

  async getQuestionsByKvizId(kvizId: number): Promise<Question[]> {
    try {
      const query = `SELECT * FROM questions WHERE kviz_id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [kvizId]);

      return rows.map(row => new Question(row.id, row.kviz_id, row.tekst_pitanja));
    } catch (error) {
      console.error("Error fetching questions by kviz_id:", error);
      return [];
    }
  }

  async getById(id: number): Promise<Question | null> {
    try {
      const query = `SELECT * FROM questions WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new Question(row.id, row.kviz_id, row.tekst_pitanja);
      }

      return null;
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      return null;
    }
  }

  async createQuestion(question: Question): Promise<Question> {
    try {
      const query = `
        INSERT INTO questions (kviz_id, tekst_pitanja)
        VALUES (?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        question.kviz_id,
        question.tekst_pitanja
      ]);

      if (result.insertId) {
        return new Question(result.insertId, question.kviz_id, question.tekst_pitanja);
      }

      return new Question(); // Prazan ako insert ne uspe
    } catch (error) {
      console.error("Error creating question:", error);
      return new Question();
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM questions WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting question:", error);
      return false;
    }
  }
}
