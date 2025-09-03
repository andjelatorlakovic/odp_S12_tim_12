import { UserLanguageLevel } from "../../../Domain/models/UserLanguageLevel";
import db from "../../../Database/connection/DbConnectionPool";

import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { IUserLanguageLevelRepository } from "../../../Database/repositories/userLanguage/IUserLanguageRepository";

export class UserLanguageLevelRepository implements IUserLanguageLevelRepository {

  // Dohvatanje specifičnog nivoa jezika za korisnika
  async getByUserLanguageAndLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevel> {
    try {
      const query = `
        SELECT * FROM user_language_levels
        WHERE user_id = ? AND jezik = ? AND nivo = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId, jezik, nivo]);

      if (rows.length > 0) {
        const row = rows[0];
        return new UserLanguageLevel(row.user_id, row.jezik, row.nivo);
      }

      return new UserLanguageLevel();
    } catch (error) {
      console.error("Error getting user language level:", error);
      return new UserLanguageLevel();
    }
  }
  // Dohvata jezike koje korisnik jos uvek ne pohadja
  async getLanguagesUserDoesNotHave(userId: number): Promise<string[]> {
    try {
      const query = `
        SELECT distinct(l.jezik)
        FROM language_levels l
        LEFT JOIN user_language_levels ull ON l.jezik = ull.jezik AND ull.user_id = ?
        WHERE ull.jezik IS NULL
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);

      // Mapiramo rezultat na niz stringova jezika
      return rows.map(row => row.jezik);
    } catch (error) {
      console.error("Error getting languages user does not have:", error);
      return [];
    }
  }
async updateKrajNivoa(userId: number, jezik: string, nivo: string): Promise<boolean> {
    try {
      const query = `
        UPDATE user_language_levels
        SET krajNivoa = NOW()
        WHERE user_id = ? AND jezik = ? AND nivo = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [userId, jezik, nivo]);

      // ResultSetHeader ima affectedRows da proveriš koliko redova je ažurirano
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating krajNivoa:", error);
      return false;
    }
  }
  // Nova metoda: Dohvatanje jezika za korisnika (bez nivoa) da se proveri da li već postoji jezik
  async getByUserAndLanguage(userId: number, jezik: string): Promise<UserLanguageLevel> {
    try {
      const query = `
        SELECT * FROM user_language_levels
        WHERE user_id = ? AND jezik = ? AND krajNivoa IS NULL
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId, jezik]);

      if (rows.length > 0) {
        const row = rows[0];
        return new UserLanguageLevel(row.user_id, row.jezik, row.nivo);
      }

      return new UserLanguageLevel();
    } catch (error) {
      console.error("Error getting user language by user and language:", error);
      return new UserLanguageLevel();
    }
  }

  // Kreiranje novog jezika i nivoa za korisnika
  async createUserLanguageLevel(userLanguageLevel: UserLanguageLevel): Promise<UserLanguageLevel> {
  try {
    // Provera da li korisnik već ima taj jezik (bilo koji nivo)
    const existing = await this.getByUserLanguageAndLevel(userLanguageLevel.userId, userLanguageLevel.jezik,userLanguageLevel.nivo);
    if (existing.userId!==0) {
      // Korisnik već ima dati jezik (bilo koji nivo)
      console.warn(`Korisnik već ima jezik ${userLanguageLevel.jezik}`);
      return new UserLanguageLevel(); // Vrati prazno (ili možeš baciti grešku po želji)
    }

    const query = `
      INSERT INTO user_language_levels (user_id, jezik, nivo)
      VALUES (?, ?, ?)
    `;

    await db.execute<ResultSetHeader>(query, [
      userLanguageLevel.userId,
      userLanguageLevel.jezik,
      userLanguageLevel.nivo
    ]);

    return userLanguageLevel;
  } catch (error) {
    console.error("Error creating user language level:", error);
    return new UserLanguageLevel();
  }
}
  async getFinishedLevelsByUsername(korisnickoIme: string): Promise<{
  korisnickoIme: string;
  jezik: string;
  nivo: string;
  pocetakNivoa: Date;
  krajNivoa: Date;
  dani: number;
}[]> {
  try {
    const query = `
      SELECT 
        u.korisnickoIme,
        ull.jezik,
        ull.nivo,
        ull.pocetakNivoa,
        ull.krajNivoa,
        DATEDIFF(ull.krajNivoa, ull.pocetakNivoa) AS dani
      FROM 
        user_language_levels ull
      JOIN 
        users u ON ull.user_id = u.id
      WHERE 
        u.korisnickoIme = ? 
        AND ull.pocetakNivoa IS NOT NULL 
        AND ull.krajNivoa IS NOT NULL
      ORDER BY 
        ull.jezik, ull.nivo
    `;

    const [rows] = await db.execute<RowDataPacket[]>(query, [korisnickoIme]);

    return rows.map(row => ({
      korisnickoIme: row.korisnickoIme,
      jezik: row.jezik,
      nivo: row.nivo,
      pocetakNivoa: row.pocetakNivoa,
      krajNivoa: row.krajNivoa,
      dani: row.dani, // broj dana
    }));
  } catch (error) {
    console.error("Error getting finished levels by username:", error);
    return [];
  }
}

}
