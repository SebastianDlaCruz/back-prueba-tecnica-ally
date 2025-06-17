-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS AllyDB;

-- Crear la base de datos
CREATE DATABASE AllyDB;

-- Usar la base de datos
USE AllyDB;

CREATE TABLE Auth(
  uuid BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  session_start_date DATETIME,  
  register_date  DATETIME,
  PRIMARY KEY (uuid),
  INDEX (EMAIL)
);


CREATE TABLE Country (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE City (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  id_country INT NOT NULL,  
  FOREIGN KEY (id_country) REFERENCES Country(id)  
);

CREATE TABLE TAsk(
  id INT AUTO_INCREMENT PRIMARY KEY,
  task VARCHAR(500),
  id_country INT,
  FOREIGN KEY (id_country) REFERENCES Country(id)
);

INSERT INTO Country (name) VALUES 
('Argentina'),
('Perú'),
('México');


INSERT INTO City (name ,id_country) VALUES
('Buenos Aires',1),
('Córdoba',1),
('Mendoza',1),
('Lima',2),
('Cusco',2), 
('Arequipa',2), 
('Guadalajara',3), 
('Monterrey',3), 
('Mexico City',3);



INSERT INTO Task (task, id_country) VALUES 
('Preparar un buen asado con amigos', 1),
('Bailar tango en La Boca', 1),
('Tomar mate en el parque', 1);

INSERT INTO Task (task, id_country) VALUES 
('Cocinar un ceviche tradicional', 2),
('Visitar las montañas de colores', 2),
('Comprar artesanías en un mercado local', 2);

INSERT INTO Task (task, id_country) VALUES 
('Preparar tacos al pastor caseros', 3),
('Aprender a hacer piñatas para fiestas', 3),
('Tomar fotos en un pueblo mágico', 3);
