import { UserQuizSummaryDto } from "../../Domain/DTOs/userQuiz/UserLevelDto";
import { UserQuizCountDto } from "../../Domain/DTOs/userQuiz/UserQuizCountDto";
import { UserQuizResultDto } from "../../Domain/DTOs/userQuiz/UserQuizDto";
import { UserQuizResultRepository } from "../../Domain/repositories/userQuiz/UserQuizRepository";

import { IUserQuizResultService } from "../../Domain/services/userQuiz/IUserQuizService";

export class UserQuizResultService implements IUserQuizResultService {
  private userQuizResultRepository: UserQuizResultRepository;

  constructor(userQuizResultRepository: UserQuizResultRepository) {
    this.userQuizResultRepository = userQuizResultRepository;
  }

  async kreirajRezultat(
    userId: number,
    kvizId: number,
    jezik: string,
    nivo: string,
    procenatTacnihOdgovora: number
  ): Promise<UserQuizResultDto> {
    try {
      const postoji = await this.userQuizResultRepository.getByUserAndKviz(userId, kvizId);
      if (postoji) {
        // Ako rezultat već postoji, vrati postojeći
        return new UserQuizResultDto(
          postoji.userId,
          postoji.kvizId,
          postoji.jezik,
          postoji.nivo,
          postoji.procenatTacnihOdgovora
        );
      }

      const rezultat = await this.userQuizResultRepository.createResult({
        userId,
        kvizId,
        jezik,
        nivo,
        procenatTacnihOdgovora
      });

      return new UserQuizResultDto(
        rezultat.userId,
        rezultat.kvizId,
        rezultat.jezik,
        rezultat.nivo,
        rezultat.procenatTacnihOdgovora
      );
    } catch (error) {
      console.error("Greška prilikom kreiranja rezultata:", error);
      return new UserQuizResultDto();
    }
  }

  async dobaviSveRezultate(): Promise<UserQuizResultDto[]> {
    try {
      const rezultati = await this.userQuizResultRepository.getAllResults();

      if (!rezultati || rezultati.length === 0) {
        return [];
      }

      return rezultati.map(
        r => new UserQuizResultDto(r.userId, r.kvizId, r.jezik, r.nivo, r.procenatTacnihOdgovora)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja svih rezultata:", error);
      return [];
    }
  }

  async dobaviRezultatPoUserIKviz(userId: number, kvizId: number): Promise<UserQuizResultDto | null> {
    try {
      const rezultat = await this.userQuizResultRepository.getByUserAndKviz(userId, kvizId);

      if (rezultat) {
        return new UserQuizResultDto(
          rezultat.userId,
          rezultat.kvizId,
          rezultat.jezik,
          rezultat.nivo,
          rezultat.procenatTacnihOdgovora
        );
      }

      return null;
    } catch (error) {
      console.error("Greška prilikom dobijanja rezultata po korisniku i kvizu:", error);
      return null;
    }
  }

  async dobaviRezultatePoUser(userId: number): Promise<UserQuizResultDto[]> {
    try {
      const rezultati = await this.userQuizResultRepository.getByUser(userId);

      if (!rezultati || rezultati.length === 0) {
        return [];
      }

      return rezultati.map(
        r => new UserQuizResultDto(r.userId, r.kvizId, r.jezik, r.nivo, r.procenatTacnihOdgovora)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja rezultata po korisniku:", error);
      return [];
    }
  }

  async dobaviRezultatePoKviz(kvizId: number): Promise<UserQuizResultDto[]> {
    try {
      const rezultati = await this.userQuizResultRepository.getByKviz(kvizId);

      if (!rezultati || rezultati.length === 0) {
        return [];
      }

      return rezultati.map(
        r => new UserQuizResultDto(r.userId, r.kvizId, r.jezik, r.nivo, r.procenatTacnihOdgovora)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja rezultata po kvizu:", error);
      return [];
    }
  }

  async obrisiRezultat(userId: number, kvizId: number): Promise<boolean> {
    try {
      const rezultat = await this.userQuizResultRepository.getByUserAndKviz(userId, kvizId);
      if (!rezultat) return false;

      return await this.userQuizResultRepository.deleteByUserAndKviz(userId, kvizId);
    } catch (error) {
      console.error("Greška prilikom brisanja rezultata:", error);
      return false;
    }
  }

  async azurirajProcenat(userId: number, kvizId: number, procenat: number): Promise<boolean> {
    try {
      const rezultat = await this.userQuizResultRepository.getByUserAndKviz(userId, kvizId);
      if (!rezultat) return false;

      return await this.userQuizResultRepository.updateProcenat(userId, kvizId, procenat);
    } catch (error) {
      console.error("Greška prilikom ažuriranja procenta:", error);
      return false;
    }
  }

  async brojKvizovaSa85(userId: number, jezik: string): Promise<number> {
    try {
      const brojKvizova = await this.userQuizResultRepository.countQuizzesAbove85(userId, jezik);
      return brojKvizova; // Vraća broj kvizova sa više od 85%
    } catch (error) {
      console.error("Greška prilikom brojanja kvizova sa više od 85.5% tačnih odgovora:", error);
      return 0; // Ako dođe do greške, vraća 0
    }
  }
 async dobaviBrojKvizovaPoUseru(): Promise<UserQuizCountDto[]> {
    try {
      // Pozivamo metodu iz repozitorijuma
      const rezultati = await this.userQuizResultRepository.getQuizCountByUser();

      // Ako nema rezultata, vraćamo prazan niz
      if (!rezultati || rezultati.length === 0) {
        return [];
      }

      // Mapiranje rezultata u DTO
      return rezultati.map(
        (r) => new UserQuizCountDto(r.username, r.quizCount)
      );
    } catch (error) {
      console.error("Greška prilikom dobijanja broja kvizova po korisnicima:", error);
      return []; // U slučaju greške vraćamo prazan niz
    }
  }
  // NOVA METODA koju si tražio
async dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(): Promise<UserQuizSummaryDto[]> {
  try {
    const rezultati = await this.userQuizResultRepository.getQuizzesAbove85Grouped();

    // Provera da li je rezultat prazan
    if (!rezultati || rezultati.length === 0) {
      return []; // Vraća prazan niz ako nema rezultata
    }

    // Mapiranje SQL rezultata u DTO objekte
    const mappedResults = rezultati.map(
      (r: any) => new UserQuizSummaryDto(r.user_id, r.jezik, r.nivo, r.broj_kviza)
    );

    return mappedResults;
  } catch (error) {
    console.error("Greška prilikom dobijanja kvizova sa procentom preko 85 i brojem većim od 3:", error);
    return []; // Vraća prazan niz u slučaju greške
  }
}

}
