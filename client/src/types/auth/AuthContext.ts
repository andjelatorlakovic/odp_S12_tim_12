import type { AuthUser } from "./AuthUser";

export type AuthContextType = {
    user: AuthUser | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;

    blokiran: boolean;                    // status blokiranosti korisnika
    setBlokiran: (blokiran: boolean) => void;  // setter za blokiran status
}
