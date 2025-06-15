-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS AllyDB;

-- Crear la base de datos
CREATE DATABASE AllyDB;

-- Usar la base de datos
USE AllyDB;

CREATE TABLE Auth(
  uuid BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
  username: VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  session_start_date DATETIME NOT NULL,  
  register_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (uuid)
  INDEX (EMAIL)
);

cre

