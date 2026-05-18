CREATE DATABASE IF NOT EXISTS marrom_sistemadeacompanhamento
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE marrom_sistemadeacompanhamento;


CREATE TABLE IF NOT EXISTS usuarios (
  id    INT          AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS pacientes (
  id                    INT          AUTO_INCREMENT PRIMARY KEY,
  nome                  VARCHAR(255) NOT NULL,
  status_monitoramento  VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS sensores_vinculo (
  id                 INT          AUTO_INCREMENT PRIMARY KEY,
  id_sensor          VARCHAR(100) NOT NULL UNIQUE,
  id_paciente_atual  INT,
  FOREIGN KEY (id_paciente_atual) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS leituras (
  id           INT            AUTO_INCREMENT PRIMARY KEY,
  id_sensor    VARCHAR(100),
  id_paciente  INT            NOT NULL,
  temperatura  DECIMAL(5,2)   NOT NULL,
  umidade      DECIMAL(5,2)   NOT NULL,
  data_hora    DATETIME       DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
);

INSERT INTO sensores_vinculo (id_sensor, id_paciente_atual)
VALUES ('ESP32-UNIT-01', NULL);

INSERT INTO usuarios (nome, email, senha) VALUES ('ADMIN', 'admin@hospital.com', '123456');