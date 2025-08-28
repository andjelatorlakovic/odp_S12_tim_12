import { Language } from '../../models/Language';
import db from "../../../Database/connection/DbConnectionPool";


export class LanguagesRepository {
  async getAllLanguages(): Promise<Language[]> {
    const [rows] = await db.query('SELECT * FROM languages');
    return rows as Language[];
  }
  
  async createLanguage(name: string): Promise<Language> {
  const [result]: any = await db.query(
    'INSERT INTO languages (name) VALUES (?)',
    [name]
  );

  const insertedId = result.insertId;

  return {
    id: insertedId,
    name: name,
  };
}

}
