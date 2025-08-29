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


  // Create new language level entry
  async createLanguageLevels(languageLevel: LanguageLevel): Promise<LanguageLevel> {
  try {
    const query = `
      INSERT INTO language_levels (jezik, naziv)
      VALUES (?, ?)
    `;

    console.log("Izvršavanje SQL upita:", query, languageLevel); // Logovanje pre SQL upita

    const [result] = await db.execute<ResultSetHeader>(query, [
      languageLevel.jezik,
      languageLevel.naziv
    ]);

    console.log("Rezultat SQL upita:", result); // Logovanje nakon SQL upita

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
