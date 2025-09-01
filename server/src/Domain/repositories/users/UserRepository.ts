
import { User } from "../../../Domain/models/User";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../../Database/connection/DbConnectionPool";
import { IUserRepository } from "../../../Database/repositories/user/IUserRepository";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (korisnickoIme, uloga, lozinka, blokiran) 
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.uloga,
        user.lozinka,
        user.blokiran || false, // dodaj default vrednost ako nema
      ]);

      if (result.insertId) {
        return new User(result.insertId, user.korisnickoIme, user.uloga, user.lozinka, user.blokiran || false);
      }

      return new User();
    } catch (error) {
      console.error('Error creating user:', error);
      return new User();
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.uloga, row.lozinka, !!row.blokiran);
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async getByUsername(korisnickoIme: string): Promise<User> {
    try {
      const query = `
        SELECT * FROM users WHERE korisnickoIme = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);

      if (rows.length > 0) {
        const row = rows[0];
        return new User(row.id, row.korisnickoIme, row.uloga, row.lozinka, !!row.blokiran);
      }

      return new User();
    } catch (error) {
      console.log("user get by username: " + error);
      return new User();
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users ORDER BY id ASC`;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      
      return rows.map(
        (row) => new User(row.id, row.korisnickoIme, row.uloga, row.lozinka, !!row.blokiran)
      );
    } catch {
      return [];
    }
  }

  async update(user: User): Promise<User> {
    try {
      const query = `
        UPDATE users 
        SET korisnickoIme = ?, lozinka = ?, uloga = ?, blokiran = ? 
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.korisnickoIme,
        user.lozinka,
        user.uloga,
        user.blokiran || false,
        user.id,
      ]);

      if (result.affectedRows > 0) {
        return user;
      }

      return new User();
    } catch {
      return new User();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM users WHERE id = ?`;

      const [result] = await db.execute<ResultSetHeader>(query, [id]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count FROM users WHERE id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
      const count = (rows[0] as any).count;
      return count > 0;
    } catch {
      return false;
    }
  }
}
