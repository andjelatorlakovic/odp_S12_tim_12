-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS DEFAULT_DB;

-- Koriscenje default baze podataka
USE DEFAULT_DB;

-- Kreiranje tabele za korisnike
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    korisnickoIme VARCHAR(50) UNIQUE NOT NULL,
    uloga VARCHAR(15) NOT NULL,
    lozinka VARCHAR(500) NOT NULL,
    blokiran BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jezik VARCHAR(50) NOT NULL
);

INSERT INTO languages (id, jezik) VALUES (1, 'Engleski');
INSERT INTO languages (id, jezik) VALUES (2, 'Nemački');

CREATE TABLE IF NOT EXISTS levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    language_id INT NOT NULL,
    nivo VARCHAR(10) NOT NULL,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

INSERT INTO levels (language_id, nivo) VALUES (1, 'A1');
INSERT INTO levels (language_id, nivo) VALUES (1, 'A2');
INSERT INTO levels (language_id, nivo) VALUES (1, 'B1');
INSERT INTO levels (language_id, nivo) VALUES (2, 'A1');
INSERT INTO levels (language_id, nivo) VALUES (2, 'A2');