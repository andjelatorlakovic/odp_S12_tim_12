
import { Answer } from "../../../Domain/models/Answer";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../../Database/connection/DbConnectionPool";
import { IAnswerRepository } from "../../../Database/repositories/answer/IAnswerRepository";

export class AnswerRepository implements IAnswerRepository {
  async getAllAnswers(): Promise<Answer[]> {
    try {
      const query = `SELECT * FROM answers`;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(row => new Answer(row.id, row.pitanje_id, row.tekst_odgovora, row.tacan));
    } catch (error) {
      console.error("Greška prilikom učitavanja svih odgovora:", error);
      return [];
    }
  }

  async getAnswersByPitanjeId(pitanjeId: number): Promise<Answer[]> {
    try {
      const query = `SELECT * FROM answers WHERE pitanje_id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [pitanjeId]);
      return rows.map(row => new Answer(row.id, row.pitanje_id, row.tekst_odgovora, row.tacan));
    } catch (error) {
      console.error(`Greška prilikom učitavanja odgovora za pitanje ID ${pitanjeId}:`, error);
      return [];
    }
  }

  async getById(id: number): Promise<Answer | null> {
    try {
      const query = `SELECT * FROM answers WHERE id = ? LIMIT 1`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Answer(row.id, row.pitanje_id, row.tekst_odgovora, row.tacan);
      }
      return null;
    } catch (error) {
      console.error(`Greška prilikom učitavanja odgovora sa ID ${id}:`, error);
      return null;
    }
  }

  async createAnswer(answer: Answer): Promise<Answer> {
    try {
      const query = `
        INSERT INTO answers (pitanje_id, tekst_odgovora, tacan)
        VALUES (?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        answer.pitanje_id,
        answer.tekst_odgovora,
        answer.tacan
      ]);

      if (result.affectedRows > 0) {
        return new Answer(result.insertId, answer.pitanje_id, answer.tekst_odgovora, answer.tacan);
      } else {
        console.error("Unos nije uspeo: affectedRows = 0");
        return new Answer();
      }
    } catch (error) {
      console.error("Greška prilikom unosa odgovora:", error);
      return new Answer();
    }
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM answers WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Greška prilikom brisanja odgovora sa ID ${id}:`, error);
      return false;
    }
  }
}
