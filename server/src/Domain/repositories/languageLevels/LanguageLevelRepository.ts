import { ILanguageLevelRepository } from "./ILanguageLevelRepository";
import { LanguageLevel } from "../../../Domain/models/LagnuageLevel";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../../../Database/connection/DbConnectionPool";

export class LanguageLevelRepository implements ILanguageLevelRepository {
  // Get all language levels
  async getAllLanguageLevels(): Promise<LanguageLevel[]> {
    try {
      const query = `SELECT * FROM language_levels `;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => new LanguageLevel(row.jezik, row.naziv)
      );
    } catch (error) {
      console.error('Error fetching language levels:', error);
      return [];
    }
  }
  async getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]> {
    try {
      const query = `
      SELECT l.jezik, COALESCE(ll.naziv, 'Nema nivoa') AS nivo
      FROM languages l
      LEFT JOIN language_levels ll ON l.jezik = ll.jezik
      ORDER BY l.jezik, ll.naziv;
    `;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      // Grupisanje nivoa po jeziku
      const map = new Map<string, Set<string>>();

      for (const row of rows) {
        if (!map.has(row.jezik)) {
          map.set(row.jezik, new Set());
        }
        if (row.nivo) {
          map.get(row.jezik)!.add(row.nivo);
        }
      }

      // Pretvori u niz objekata sa nizom nivoa
      const result = Array.from(map.entries()).map(([jezik, nivoiSet]) => ({
        jezik,
        nivoi: Array.from(nivoiSet),
      }));

      return result;

    } catch (error) {
      console.error('Greška pri dohvatanju jezika sa nivoima:', error);
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
