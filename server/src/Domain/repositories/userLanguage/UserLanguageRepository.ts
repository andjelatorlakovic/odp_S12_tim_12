import { UserLanguageLevel } from "../../models/UserLanguageLevel";
import db from "../../../Database/connection/DbConnectionPool";
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { IUserLanguageLevelRepository } from "../../../Database/repositories/userLanguage/IUserLanguageRepository";

export class UserLanguageLevelRepository implements IUserLanguageLevelRepository {
  
  // Dobijanje nivoa korisnika za određeni jezik
  async getByUserAndLanguage(userId: number, jezik: string): Promise<UserLanguageLevel> {
    try {
      const query = `
        SELECT * FROM user_language_levels 
        WHERE user_id = ? AND jezik = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [userId, jezik]);

      if (rows.length > 0) {
        const row = rows[0];
        return new UserLanguageLevel(row.user_id, row.jezik, row.nivo);
      }

      // Ako nije pronađen, vraća prazan objekat
      return new UserLanguageLevel();
    } catch (error) {
      console.log("Error getting user language level: " + error);
      return new UserLanguageLevel();  // Prazan objekat u slučaju greške
    }
  }

  // Dobijanje svih jezika i nivoa koje korisnik uči
  async getAllByUser(userId: number): Promise<UserLanguageLevel[]> {
    try {
      const query = `
        SELECT * FROM user_language_levels 
        WHERE user_id = ?
      `;
      
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
      return rows.map(row => new UserLanguageLevel(row.user_id, row.jezik, row.nivo));
    } catch (error) {
      console.log("Error getting all user language levels: " + error);
      return [];  // Ako dođe do greške, vraća praznu listu
    }
  }

  // Dodavanje jezika i nivoa za korisnika
  async createUserLanguageLevel(userLanguageLevel: UserLanguageLevel): Promise<UserLanguageLevel> {
    try {
      const query = `
        INSERT INTO user_language_levels (user_id, jezik, nivo)
        VALUES (?, ?, ?)
      `;
      
      const [result] = await db.execute<ResultSetHeader>(query, [
        userLanguageLevel.userId,
        userLanguageLevel.jezik,
        userLanguageLevel.nivo
      ]);
      console.log("sdfsfs");
      // Ako je unos uspešan, vraća dodeljeni ID i podatke
      if (result.insertId) {

        return new UserLanguageLevel(userLanguageLevel.userId, userLanguageLevel.jezik, userLanguageLevel.nivo);
      }

      return new UserLanguageLevel();  // Vraća prazan objekat ako nije uspešno
    } catch (error) {
      console.log("Error creating user language level: " + error);
      return new UserLanguageLevel();  // Vraća prazan objekat u slučaju greške
    }
  }

  // Ažuriranje nivoa jezika za korisnika
  async updateUserLanguageLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevel> {
    try {
      const query = `
        UPDATE user_language_levels
        SET nivo = ?
        WHERE user_id = ? AND jezik = ?
      `;
      
      const [result] = await db.execute<ResultSetHeader>(query, [nivo, userId, jezik]);

      if (result.affectedRows > 0) {
        return new UserLanguageLevel(userId, jezik, nivo);  // Vraća ažurirane podatke
      }

      return new UserLanguageLevel();  // Ako nije ništa ažurirano, vraća prazan objekat
    } catch (error) {
      console.log("Error updating user language level: " + error);
      return new UserLanguageLevel();  // Vraća prazan objekat u slučaju greške
    }
  }

  // Brisanje jezika i nivoa za korisnika
  async deleteUserLanguageLevel(userId: number, jezik: string): Promise<void> {
    try {
      const query = `
        DELETE FROM user_language_levels
        WHERE user_id = ? AND jezik = ?
      `;
      
      const [result] = await db.execute<ResultSetHeader>(query, [userId, jezik]);

      if (result.affectedRows === 0) {
        console.log("No record found to delete.");
      }
    } catch (error) {
      console.log("Error deleting user language level: " + error);
    }
  }
}
