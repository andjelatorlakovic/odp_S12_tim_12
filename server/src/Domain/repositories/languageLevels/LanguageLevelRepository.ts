import { LanguageLevel } from "../../../Domain/models/LagnuageLevel";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../../Database/connection/DbConnectionPool";
import { ILanguageLevelRepository } from "../../../Database/repositories/languageLevel/ILanguageLevelRepository";

export class LanguageLevelRepository implements ILanguageLevelRepository {
 
async getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]> {
    try {
      const query = `
        SELECT l.jezik, ll.naziv AS nivo
        FROM languages l
        INNER JOIN language_levels ll ON l.jezik = ll.jezik
        ORDER BY l.jezik, ll.naziv
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query);

      // Grupisanje po jeziku
      const map = new Map<string, string[]>();
      rows.forEach(row => {
        if (!map.has(row.jezik)) map.set(row.jezik, []);
        map.get(row.jezik)?.push(row.nivo);
      });

      return Array.from(map.entries()).map(([jezik, nivoi]) => ({ jezik, nivoi }));
    } catch (error) {
      console.error("Greška pri učitavanju jezika sa nivoima:", error);
      return [];
    }
  }

  // Create new language level entry
  async createLanguageLevels(languageLevel: LanguageLevel): Promise<LanguageLevel> {
    try {
      const query = `
      INSERT INTO language_levels (jezik, naziv)
      VALUES (?, ?)
    `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        languageLevel.jezik,
        languageLevel.naziv
      ]);

      if (result.affectedRows > 0) {
        return new LanguageLevel(languageLevel.jezik, languageLevel.naziv);
      } else {
        console.error("Unos nije uspeo: Nema pogođenih redova (affectedRows = 0)");
        return new LanguageLevel();
      }

    } catch (error) {
      console.error('Greška prilikom izvršavanja SQL upita:', error); // Dodajemo detaljniji log greške
      return new LanguageLevel(); // Vraćamo prazan objekat ako dođe do greške
    }
  }

}
