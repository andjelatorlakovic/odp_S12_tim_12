import { UserQuizSummaryDto } from "../../Domain/DTOs/userQuiz/UserLevelDto";
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

  // NOVA METODA koju si tražio
 async dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(): Promise<UserQuizSummaryDto[]> {
  try {
    const rezultati = await this.userQuizResultRepository.getQuizzesAbove85Grouped();

    // Pretvaranje plain objekata u instance klase UserQuizSummaryDto
    const mappedResults = rezultati.map(
      (r: any) => new UserQuizSummaryDto(r.userId, r.jezik, r.nivo, r.brojKviza)
    );

    return mappedResults;
  } catch (error) {
    console.error("Greška prilikom dobijanja kvizova sa procentom preko 85.5 i brojem većim od 3:", error);
    return [];
  }
}
}
