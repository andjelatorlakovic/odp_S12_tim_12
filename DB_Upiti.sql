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
CREATE TABLE IF NOT EXISTS levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(10) NOT NULL UNIQUE

);
CREATE TABLE IF NOT EXISTS kvizovi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naziv_kviza VARCHAR(255) NOT NULL,
  jezik VARCHAR(50) NOT NULL,
  nivo_znanja VARCHAR(10) NOT NULL,
  FOREIGN KEY (jezik, nivo_znanja) REFERENCES language_levels(jezik, naziv) ON DELETE CASCADE,
  UNIQUE (id, jezik, nivo_znanja) 
);
CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pitanje_id INT NOT NULL,                     
  tekst_odgovora VARCHAR(255) NOT NULL,      
  tacan BOOLEAN NOT NULL DEFAULT FALSE,        
  FOREIGN KEY (pitanje_id) REFERENCES questions(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS user_quiz_results (
    user_id INT NOT NULL,
    kviz_id INT NOT NULL,
    jezik VARCHAR(20) NOT NULL,
    nivo VARCHAR(20) NOT NULL,
    procenat_tacnih_odgovora DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    FOREIGN KEY (kviz_id) REFERENCES kvizovi(id) ON DELETE CASCADE,
    
    FOREIGN KEY (kviz_id, jezik, nivo) REFERENCES kvizovi(id, jezik, nivo_znanja) ON DELETE CASCADE,

    FOREIGN KEY (user_id, jezik, nivo) REFERENCES user_language_levels(user_id, jezik, nivo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kviz_id INT NOT NULL,
    tekst_pitanja TEXT NOT NULL,
    FOREIGN KEY (kviz_id) REFERENCES kvizovi(id) ON DELETE CASCADE
);
UPDATE user_language_levels
SET krajNivoa = NOW()
WHERE user_id = ? AND jezik = ? AND nivo = ?;

INSERT INTO levels (naziv)
VALUES ('A1'),
       ('A2'),
       ('B1'),
       ('B2'),
       ('C1'),
       ('C2');
CREATE TABLE IF NOT EXISTS languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jezik VARCHAR(50) NOT NULL UNIQUE
);
ALTER TABLE user_language_levels
ADD COLUMN pocetakNivoa DATE DEFAULT CURRENT_DATE,
ADD COLUMN krajNivoa DATE NULL;
CREATE TABLE IF NOT EXISTS user_language_levels (
    user_id INT,
    jezik VARCHAR(20),
    nivo VARCHAR(20),
    PRIMARY KEY (user_id, jezik,nivo),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jezik, nivo) REFERENCES language_levels(jezik, naziv) ON DELETE CASCADE
);

INSERT INTO user_language (user_id, jezik_id)
VALUES (1, 2)
CREATE TABLE IF NOT EXISTS user_quiz_results (
    user_id INT NOT NULL,
    kviz_id INT NOT NULL,
    jezik VARCHAR(20) NOT NULL,
    nivo VARCHAR(20) NOT NULL,
    procenat_tacnih_odgovora DECIMAL(5,2) NOT NULL,
    
    PRIMARY KEY (user_id, kviz_id),

    FOREIGN KEY (kviz_id) REFERENCES kvizovi(id) ON DELETE CASCADE,

    FOREIGN KEY (kviz_id, jezik, nivo) REFERENCES kvizovi(id, jezik, nivo_znanja) ON DELETE CASCADE,

    FOREIGN KEY (user_id, jezik, nivo) REFERENCES user_language_levels(user_id, jezik, nivo) ON DELETE CASCADE
);


INSERT INTO languages (id, jezik) VALUES (1, 'Engleski');
INSERT INTO languages (id, jezik) VALUES (2, 'Nemački');

CREATE TABLE IF NOT EXISTS language_levels (
    jezik varchar(20),
    naziv  varchar(20),
    PRIMARY KEY (jezik, naziv),
    FOREIGN KEY (jezik) REFERENCES languages(jezik) ON DELETE CASCADE,
    FOREIGN KEY (naziv) REFERENCES levels(naziv) ON DELETE CASCADE
);
