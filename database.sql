CREATE DATABASE camping_paradise;

USE camping_paradise;

-- Table utilisateurs 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user'
);

-- Table hebergement
CREATE TABLE hebergement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    capacite INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    prix_haute_saison DECIMAL(10, 2) NOT NULL,
    prix_basse_saison DECIMAL(10, 2) NOT NULL
);

-- Table promotion
CREATE TABLE promotion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    remise DECIMAL(5, 2) NOT NULL
);

-- Table reservation
CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_reservation DATE NOT NULL,
    date_entree DATE NOT NULL,
    date_sortie DATE NOT NULL,
    hebergement_id INT,
    user_id INT,
    nom VARCHAR(50) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    solde_restant DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (hebergement_id) REFERENCES hebergement(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert des utilisateurs 
INSERT INTO users (lastname, firstname, email, password, role) VALUES
('admin', 'admin', 'admin@admin.com', '@Admin1234!', 'admin'),
('user', 'user', 'user@user.com', '@User1234!', 'user');

-- Insert des hebergements
INSERT INTO hebergement (numero, capacite, type, prix_haute_saison, prix_basse_saison) VALUES
(101, 4, 'Camping-car', 150.00, 100.00),
(102, 2, 'Tente', 80.00, 50.00),
(103, 6, 'Chalet', 200.00, 150.00);

-- Insert des promotions
INSERT INTO promotion (nom, remise) VALUES
('Promo été', 10.00),
('Promo hiver', 15.00);