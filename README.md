# Projeto MArrOM: Monitoramento Não-Invasivo de Feridas (IoT)

Sistema de Internet das Coisas (IoT) para monitoramento remoto e não-invasivo de temperatura e umidade em lesões cutâneas.

---

### Hardware (IoT)
* **Microcontrolador:** ESP32 DevKit V1
* **Sensores:** MLX90614 (Temperatura Infravermelha $I^2C$) e DHT22 (Umidade Digital)
* **Autonomia:** Bateria de Lítio 18650 + Módulo Shield V3 (Portátil)
* **Protocolo:** MQTT (Broker HiveMQ)

### Software
* **Back-End:** Node.js + Express (Arquitetura MVC + Service Layer + DAO)
* **Front-End:** HTML, CSS, JS + Chart.js
* **Segurança:** Token JWT

---

## Estrutura de Dados (Persistência Dupla)

* **MySQL (Transacional):** Armazena dados de negócio normalizados (3FN). Tabelas: `pacientes`, `tipos_feridas`, `pacientes_feridas` (Vínculo N:N com Chave Primária Composta contra duplicidade) e `leituras_sensores`.
* **MongoDB (Auditoria/NoSQL):** Caixa-preta de alta performance para logs flexíveis (`LOGIN_SUCESSO`, `ACESSO_ROTA`, `ERRO`).

---

## Endpoints Principais

* `POST /api/v1/auth/login` -> Login e emissão de JWT
* `POST /api/v1/pacientes-feridas` -> Criação do vínculo N:N (Paciente-Ferida)
* `POST /api/v1/leituras` -> Ingestão de telemetria enviada pelo hardware
* `GET /api/v1/backup` -> Download do backup do MySQL em JSON
* `GET /api/v1/logs/exportar-xml` -> Download da auditoria do MongoDB em XML
* `GET /api/v1/relatorios/pdf/:idPaciente` -> Geração de relatório clínico via PDFKit

---

##  Como Rodar o Projeto

### 1. Requisitos
* Node.js
* XAMPP (Apache e MySQL)
* MongoDB Community Server

### 2. Instalação e Execução

```bash
# 1. Clone o repositório e navegue até a pasta
git clone [https://github.com/romulolpaula/Projeto-MArrOM](https://github.com/romulolpaula/Projeto-MArrOM)
cd Projeto-MArrOM

# 2. Instale as dependências do Node.js
npm install

# 3. Configure o Banco de Dados Relacional
# Inicie o módulo MySQL no XAMPP e importe o script de tabelas no phpMyAdmin

# 4. Inicialize o ecossistema (Rode cada comando em um terminal separado)
node Server.js        # Inicializa o servidor base do sistema
node app.js           # Inicializa a API Express e conexões com os bancos
node monitor_mqtt.js  # Inicializa o escutador de telemetria do ESP32
