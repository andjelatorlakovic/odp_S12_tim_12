import { Language } from '../../models/Language';
import db from "../../../Database/connection/DbConnectionPool";
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ILanguageRepository } from '../../../Database/repositories/language/ILanguagesRepository';


export class LanguagesRepository implements ILanguageRepository {
  async getByName(jezik: string): Promise<Language> {
    try {
      const query = `
        SELECT * FROM languages WHERE jezik = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [jezik]);

      if (rows.length > 0) {
        const row = rows[0];
        return new Language(row.id, row.jezik);
      }

      return new Language(0, '');  // Prazan objekat ako je jezik nepoznat
    } catch (error) {
      console.log("Error getting language by name: " + error);
      return new Language(0, '');  // Prazan objekat ako dođe do greške
    }
  }
  async createLanguage(language: Language): Promise<Language> {
    try{
    const query = `
  INSERT INTO languages (jezik) 
  VALUES (?)
`;

    const [result] = await db.execute<ResultSetHeader>(query, [language.jezik]);

    // Ako je unos uspešan, koristi dodeljeni ID
    if (result.insertId) {
      return new Language(result.insertId, language.jezik);
    }

    // Ako unos nije uspešan, vrati prazan objekat
    return new Language();}
    catch{
      return new Language();
    }
  }
  async getAllLanguages(): Promise<Language[]> {
    const [rows] = await db.query('SELECT * FROM languages');
    return rows as Language[];
  }



}
