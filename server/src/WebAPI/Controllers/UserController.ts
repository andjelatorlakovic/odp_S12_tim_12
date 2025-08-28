import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/autentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/korisnici",
      authenticate,
      authorize("moderator"),
      this.korisnici.bind(this)
    );

    this.router.post(
      "/korisnici/blokiraj",
      authenticate,
      authorize("moderator"),
      this.blokirajKorisnike.bind(this)
    );

    
    this.router.post(
      "/korisnici/odblokiraj",
      authenticate,
      authorize("moderator"),
      this.odblokirajKorisnike.bind(this)
    );
  }

  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] = await this.userService.getSviKorisnici();

      res.status(200).json(korisniciPodaci);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nepoznata greška";
      res.status(500).json({ success: false, message: errorMessage });
    }
  }

  private async blokirajKorisnike(req: Request, res: Response): Promise<void> {
    try {
      const { userIds } = req.body as { userIds: number[] };

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ success: false, message: "Morate poslati niz ID korisnika za blokiranje." });
        return;
      }

      await this.userService.blokirajKorisnike(userIds);

      res.status(200).json({ success: true, message: "Korisnici uspešno blokirani." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nepoznata greška";
      res.status(500).json({ success: false, message: errorMessage });
    }
  }

 private async odblokirajKorisnike(req: Request, res: Response): Promise<void> {
  try {
    const { userIds } = req.body as { userIds: number[] };

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ success: false, message: "Morate poslati niz ID korisnika za odblokiranje." });
      return;
    }

    await this.userService.odblokirajKorisnike(userIds);  // obavezno ovde pozovi odblokirajKorisnike

    res.status(200).json({ success: true, message: "Korisnik uspešno odblokiran." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Nepoznata greška";
    res.status(500).json({ success: false, message: errorMessage });
  }
}

  public getRouter(): Router {
    return this.router;
  }
}
