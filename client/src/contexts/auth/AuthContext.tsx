import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { AuthContextType } from '../../types/auth/AuthContext';
import type { AuthUser } from '../../types/auth/AuthUser';
import { ObrišiVrednostPoKljuču, PročitajVrednostPoKljuču, SačuvajVrednostPoKljuču } from '../../helpers/local_storage';
import type { JwtTokenClaims } from '../../types/auth/JwtTokenClaims';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper funkcija za dekodiranje JWT tokena
const decodeJWT = (token: string): JwtTokenClaims | null => {
    try {
        const decoded = jwtDecode<JwtTokenClaims>(token);
        
        // Proveri da li token ima potrebna polja
        if (decoded.id && decoded.korisnickoIme && decoded.uloga) {
            return {
                id: decoded.id,
                korisnickoIme: decoded.korisnickoIme,
                uloga: decoded.uloga,
                blokiran: decoded.blokiran ?? false, // dodaj blokiran polje
            };
        }
        
        return null;
    } catch (error) {
        console.error('Greška pri dekodiranju JWT tokena:', error);
        return null;
    }
};

// Helper funkcija za proveru da li je token istekao
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        return decoded.exp ? decoded.exp < currentTime : false;
    } catch {
        return true;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [blokiran, setBlokiran] = useState<boolean>(false);  // novi state

    // Učitaj token iz localStorage pri pokretanju
    useEffect(() => {
        const savedToken = PročitajVrednostPoKljuču("authToken");
        
        if (savedToken) {
            // Proveri da li je token istekao
            if (isTokenExpired(savedToken)) {
                ObrišiVrednostPoKljuču("authToken");
                setIsLoading(false);
                return;
            }
            
            const claims = decodeJWT(savedToken);
            if (claims) {
    setToken(savedToken);
    setUser({
        id: claims.id,
        korisnickoIme: claims.korisnickoIme,
        uloga: claims.uloga,
        blokiran: claims.blokiran ?? false  // obavezno polje
    });
    setBlokiran(claims.blokiran ?? false);
}
        }
        
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        const claims = decodeJWT(newToken);
        
       if (claims && !isTokenExpired(newToken)) {
    setToken(newToken);
    setUser({
        id: claims.id,
        korisnickoIme: claims.korisnickoIme,
        uloga: claims.uloga,
        blokiran: claims.blokiran ?? false  // obavezno polje
    });
    setBlokiran(claims.blokiran ?? false);
    SačuvajVrednostPoKljuču("authToken", newToken);
}
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setBlokiran(false);  // resetuj blokiran
        ObrišiVrednostPoKljuču("authToken");
    };

    const isAuthenticated = !!user && !!token;

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading,
        blokiran,        // dodaj u context
        setBlokiran      // i set funkciju
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
