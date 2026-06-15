CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `status_monitoramento` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tipos_feridas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pacientes_feridas` (
  `id_paciente` int(11) NOT NULL,
  `id_tipo_ferida` int(11) NOT NULL,
  `foto_evolucao` varchar(255) DEFAULT NULL,
  `data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_paciente`,`id_tipo_ferida`),
  CONSTRAINT `pacientes_feridas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pacientes_feridas_ibfk_2` FOREIGN KEY (`id_tipo_ferida`) REFERENCES `tipos_feridas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sensores_vinculo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sensor` varchar(100) NOT NULL,
  `id_paciente_atual` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_sensor` (`id_sensor`),
  CONSTRAINT `sensores_vinculo_ibfk_1` FOREIGN KEY (`id_paciente_atual`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `leituras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sensor` varchar(100) DEFAULT NULL,
  `id_paciente` int(11) NOT NULL,
  `temperatura` decimal(5,2) NOT NULL,
  `umidade` decimal(5,2) NOT NULL,
  `data_hora` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `leituras_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================
-- USUÁRIOS
-- =====================

INSERT INTO usuarios (nome, email, senha) VALUES
('Ana Silva', 'ana.silva@email.com', '123456'),
('Carlos Souza', 'carlos.souza@email.com', 'senha123'),
('Juliana Lima', 'juliana.lima@email.com', 'abc123'),
('Pedro Oliveira', 'pedro.oliveira@email.com', 'teste321'),
('Mariana Costa', 'mariana.costa@email.com', 'admin123');


-- =====================
-- PACIENTES
-- =====================

INSERT INTO pacientes (nome, status_monitoramento) VALUES
('José Ferreira', 'Monitoramento Ativo'),
('Fernanda Gomes', 'Estável'),
('Lucas Martins', 'Necessita Atenção'),
('Camila Rocha', 'Monitoramento Ativo'),
('Roberto Almeida', 'Alta Prevista');


-- =====================
-- TIPOS DE FERIDAS
-- =====================

INSERT INTO tipos_feridas (nome, descricao) VALUES
('Úlcera por Pressão', 'Ferida causada por pressão contínua na pele'),
('Queimadura', 'Lesão causada por calor ou substâncias químicas'),
('Ferida Cirúrgica', 'Ferida resultante de procedimento cirúrgico'),
('Escoriação', 'Lesão superficial na pele'),
('Pé Diabético', 'Complicação causada por diabetes');


-- =====================
-- PACIENTES_FERIDAS
-- (usa ids existentes)
-- =====================

INSERT INTO pacientes_feridas
(id_paciente, id_tipo_ferida, foto_evolucao)
VALUES
(1, 1, 'jose_pressao_01.jpg'),
(1, 4, 'jose_escoriacao.jpg'),
(2, 3, 'fernanda_cirurgia.jpg'),
(3, 5, 'lucas_pe_diabetico.jpg'),
(4, 2, 'camila_queimadura.jpg');


-- =====================
-- SENSORES VÍNCULO
-- =====================

INSERT INTO sensores_vinculo
(id_sensor, id_paciente_atual)
VALUES
('ESP32_001', 1),
('ESP32_002', 2),
('ESP32_003', 3),
('ESP32_004', 4),
('ESP32_005', NULL);


-- =====================
-- LEITURAS
-- =====================

INSERT INTO leituras
(id_sensor, id_paciente, temperatura, umidade, data_hora)
VALUES
('ESP32_001', 1, 36.50, 62.00, NOW()),
('ESP32_001', 1, 36.80, 64.50, NOW()),
('ESP32_002', 2, 37.10, 58.30, NOW()),
('ESP32_003', 3, 38.20, 70.10, NOW()),
('ESP32_004', 4, 35.90, 55.20, NOW()),
('ESP32_002', 2, 36.70, 61.00, NOW()),
('ESP32_003', 3, 37.50, 68.20, NOW());