import db from '../../../Database/connection/DbConnectionPool';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IUserQuizResultRepository } from '../../../Database/repositories/userQuiz/IUserQuizRepository';
import { UserQuizResult } from '../../models/UserKviz';

export class UserQuizResultRepository implements IUserQuizResultRepository {
  async getAllResults(): Promise<UserQuizResult[]> {
    try {
      const query = `SELECT * FROM user_quiz_results`;
      const [rows] = await db.query<RowDataPacket[]>(query);

      return rows.map(row => new UserQuizResult(
        row.user_id,
        row.kviz_id,
        row.jezik,
        row.nivo,
        row.procenat_tacnih_odgovora
      ));
    } catch (error) {
      console.log("Error getting all user quiz results: " + error);
      return [];
    }
  }

  async countQuizzesAbove85(userId: number, jezik: string): Promise<number> {
    try {
      const query = `
        SELECT user_id, jezik, COUNT(*) AS broj_kviza
        FROM user_quiz_results
        WHERE user_id = ? AND jezik = ?
        AND procenat_tacnih_odgovora > 85.5
        GROUP BY user_id, jezik
        HAVING COUNT(*) >= 3;
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId, jezik]);

      if (rows.length > 0) {
        return rows[0].broj_kviza;
      }
      return 0;
    } catch (error) {
      console.log("Error counting quizzes above 85%: " + error);
      return 0;
    }
  }

  async createResult(result: UserQuizResult): Promise<UserQuizResult> {
    try {
      const query = `
        INSERT INTO user_quiz_results (user_id, kviz_id, jezik, nivo, procenat_tacnih_odgovora)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [res] = await db.execute<ResultSetHeader>(query, [
        result.userId,
        result.kvizId,
        result.jezik,
        result.nivo,
        result.procenatTacnihOdgovora
      ]);

      return result;
    } catch (error) {
      console.log("Error creating user quiz result: " + error);
      return new UserQuizResult();
    }
  }

  async getByUserAndKviz(userId: number, kvizId: number): Promise<UserQuizResult | null> {
    try {
      const query = `SELECT * FROM user_quiz_results WHERE user_id = ? AND kviz_id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId, kvizId]);

      if (rows.length > 0) {
        const row = rows[0];
        return new UserQuizResult(
          row.user_id,
          row.kviz_id,
          row.jezik,
          row.nivo,
          row.procenat_tacnih_odgovora
        );
      }

      return null;
    } catch (error) {
      console.log("Error getting user quiz result by user and kviz: " + error);
      return null;
    }
  }

  async getByUser(userId: number): Promise<UserQuizResult[]> {
    try {
      const query = `SELECT * FROM user_quiz_results WHERE user_id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);

      return rows.map(row => new UserQuizResult(
        row.user_id,
        row.kviz_id,
        row.jezik,
        row.nivo,
        row.procenat_tacnih_odgovora
      ));
    } catch (error) {
      console.log("Error getting results by user: " + error);
      return [];
    }
  }

  async getByKviz(kvizId: number): Promise<UserQuizResult[]> {
    try {
      const query = `SELECT * FROM user_quiz_results WHERE kviz_id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [kvizId]);

      return rows.map(row => new UserQuizResult(
        row.user_id,
        row.kviz_id,
        row.jezik,
        row.nivo,
        row.procenat_tacnih_odgovora
      ));
    } catch (error) {
      console.log("Error getting results by kviz: " + error);
      return [];
    }
  }

  async deleteByUserAndKviz(userId: number, kvizId: number): Promise<boolean> {
    try {
      const query = `DELETE FROM user_quiz_results WHERE user_id = ? AND kviz_id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [userId, kvizId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.log("Error deleting user quiz result: " + error);
      return false;
    }
  }

  async updateProcenat(userId: number, kvizId: number, procenat: number): Promise<boolean> {
    try {
      const query = `
        UPDATE user_quiz_results
        SET procenat_tacnih_odgovora = ?
        WHERE user_id = ? AND kviz_id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [procenat, userId, kvizId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.log("Error updating procenat: " + error);
      return false;
    }
  }

  // Nova metoda koju si tražio
  async getQuizzesAbove85Grouped(): Promise<{ user_id: number; jezik: string; nivo: string; broj_kviza: number }[]> {
    try {
      const query = `
        SELECT 
    uqr.user_id, 
    uqr.jezik, 
    uqr.nivo, 
    COUNT(*) AS broj_kviza
FROM 
    user_quiz_results uqr
WHERE 
    uqr.procenat_tacnih_odgovora > 85.5
GROUP BY 
    uqr.user_id, uqr.jezik, uqr.nivo
HAVING 
    COUNT(*) >= 3
    AND NOT EXISTS (
        SELECT 1
        FROM user_language_levels ull
        WHERE 
            ull.user_id = uqr.user_id
            AND ull.jezik = uqr.jezik
            AND ull.nivo = uqr.nivo
            AND ull.krajNivoa IS not NULL
    );

      `;

      const [rows] = await db.query<RowDataPacket[]>(query);

      return rows.map(row => ({
        user_id: row.user_id,
        jezik: row.jezik,
        nivo: row.nivo,
        broj_kviza: row.broj_kviza
      }));
    } catch (error) {
      console.log("Error getting quizzes above 85.5% grouped: " + error);
      return [];
    }
  }
}
