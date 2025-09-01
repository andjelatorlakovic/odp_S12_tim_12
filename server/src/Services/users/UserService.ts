import { IUserRepository } from "../../Database/repositories/user/IUserRepository";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { User } from "../../Domain/models/User";

import { IUserService } from "../../Domain/services/users/IUserService";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async blokirajKorisnike(userIds: number[]): Promise<void> {
    for (const id of userIds) {
      const user = await this.userRepository.getById(id);
      if (user) {
        user.blokiran = true;
        await this.userRepository.update(user);
      }
    }
  }

  async odblokirajKorisnike(userIds: number[]): Promise<void> {
    for (const id of userIds) {
      const user = await this.userRepository.getById(id);
      if (user) {
        user.blokiran = false;  // ovde treba da se postavi na false da bi se odblokirao
        await this.userRepository.update(user);
      }
    }
  }

  async getSviKorisnici(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    return korisnici.map(
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga, user.blokiran)
    );
  }
}
