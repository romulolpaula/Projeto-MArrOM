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
# 1. Clone o repositório
git clone [https://github.com/romulolpaula/Projeto-MArrOM](https://github.com/romulolpaula/Projeto-MArrOM)
cd Projeto-MArrOM

# 2. Instale as dependências
npm install

# 3. Configure o arquivo .env na raiz
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=marrom_db
JWT_SECRET=sua_chave_secreta
MONGO_URI=mongodb://localhost:27017/marrom_db

# 4. Configure o banco relacional
# Inicie o MySQL no XAMPP e importe o arquivo 'script_banco.
