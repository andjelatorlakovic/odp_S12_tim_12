export interface UserDto {
    id: number;
    korisnickoIme: string;
    uloga: string;
    blokiran: boolean; 
    jeziciKojeUci: string[]; 
}