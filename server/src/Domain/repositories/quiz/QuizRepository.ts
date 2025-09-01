import { Kviz } from '../../../Domain/models/Quiz';
import db from '../../../Database/connection/DbConnectionPool';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IKvizRepository } from '../../../Database/repositories/quiz/IQuizRepository';

export class KvizRepository implements IKvizRepository {

  // Vraća kvizove koje korisnik još nije radio
  async getAvailableForUser(userId: number, jezik: string, nivo_znanja: string): Promise<Kviz[]> {
    try {
      const query = `
        SELECT k.*
        FROM kvizovi k
        LEFT JOIN user_quiz_results uqr
          ON k.id = uqr.kviz_id
          AND k.jezik = uqr.jezik
          AND k.nivo_znanja = uqr.nivo
          AND uqr.user_id = ?
        WHERE k.jezik = ?
          AND k.nivo_znanja = ?
          AND uqr.kviz_id IS NULL
      `;
      const [rows] = await db.query<RowDataPacket[]>(query, [userId, jezik, nivo_znanja]);
      return rows.map(row => new Kviz(row.id, row.naziv_kviza, row.jezik, row.nivo_znanja));
    } catch (error) {
      console.log("Error getting available kvizovi for user: " + error);
      return [];
    }
  }

  // Vraća sve kvizove
  async getAllKvizovi(): Promise<Kviz[]> {
    try {
      const query = `SELECT * FROM kvizovi`;
      const [rows] = await db.query<RowDataPacket[]>(query);
      return rows.map(row => new Kviz(row.id, row.naziv_kviza, row.jezik, row.nivo_znanja));
    } catch (error) {
      console.log("Error getting all kvizovi: " + error);
      return [];
    }
  }

  // Kreira novi kviz
  async createKviz(kviz: Kviz): Promise<Kviz> {
    try {
      const query = `
        INSERT INTO kvizovi (naziv_kviza, jezik, nivo_znanja)
        VALUES (?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        kviz.naziv_kviza,
        kviz.jezik,
        kviz.nivo_znanja
      ]);

      if (result.insertId) {
        return new Kviz(result.insertId, kviz.naziv_kviza, kviz.jezik, kviz.nivo_znanja);
      }
      return new Kviz(); // Prazan objekat ako insert nije uspeo
    } catch (error) {
      console.log("Error creating kviz: " + error);
      return new Kviz(); // Prazan objekat ako dođe do greške
    }
  }

  // Vraća kviz po ID-u
  async getById(id: number): Promise<Kviz> {
    try {
      const query = `SELECT * FROM kvizovi WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Kviz(row.id, row.naziv_kviza, row.jezik, row.nivo_znanja);
      }
      return new Kviz(); // Prazan objekat ako ne postoji kviz sa tim ID-jem
    } catch (error) {
      console.log("Error getting kviz by ID: " + error);
      return new Kviz();
    }
  }

  // Vraća kviz po kombinaciji naziv-jezik-nivo
  async getByNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<Kviz> {
    try {
      const query = `
        SELECT * FROM kvizovi 
        WHERE naziv_kviza = ? AND jezik = ? AND nivo_znanja = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [naziv_kviza, jezik, nivo_znanja]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Kviz(row.id, row.naziv_kviza, row.jezik, row.nivo_znanja);
      }
      return new Kviz();
    } catch (error) {
      console.log("Error getting kviz by naziv, jezik, nivo: " + error);
      return new Kviz();
    }
  }

  // Briše kviz po ID-u
  async deleteById(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM kvizovi WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.log("Error deleting kviz: " + error);
      return false;
    }
  }
}
