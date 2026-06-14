# Projeto MArrOM: Monitoramento Não-Invasivo de Feridas (IoT)

Sistema de Internet das Coisas (IoT) para monitoramento remoto e não-invasivo de temperatura e umidade em lesões cutâneas (feridas na pele).

---

## Visão Geral

Sensor mede temperatura e umidade próximo à ferida sem contato. O ESP32 envia os dados via MQTT para o back-end, que armazena, gera gráficos/relatórios e controla o acesso por login (JWT).

---

## Hardware (IoT)

* **Microcontrolador:** ESP32 DevKit V1
* **Sensores:** MLX90614 (temperatura infravermelha, sem contato) e DHT22 (umidade)
* **Autonomia:** Bateria de Lítio 18650 + Módulo Shield V3 (portátil)
* **Comunicação:** MQTT (Broker HiveMQ)

## Software

* **Back-End:** Node.js + Express (arquitetura MVC + Service Layer + DAO)
* **Front-End:** HTML, CSS, JS + Chart.js (gráficos)
* **Segurança:** Autenticação via Token JWT

---

## Estrutura de Dados

* **MySQL (Transacional):** armazena os dados de negócio normalizados (3FN).
  * Tabelas: `pacientes`, `tipos_feridas`, `pacientes_feridas` (vínculo N:N com chave primária composta, evitando duplicidade) e `leituras_sensores`.
* **MongoDB (Auditoria/NoSQL):** funciona como uma "caixa-preta" de alta performance para registrar eventos do sistema (`LOGIN_SUCESSO`, `ACESSO_ROTA`, `ERRO`).

---

## 🔌 Endpoints Principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login e emissão de token JWT |
| `POST` | `/api/v1/pacientes-feridas` | Cria o vínculo N:N entre paciente e ferida |
| `POST` | `/api/v1/leituras` | Recebe a telemetria enviada pelo hardware |
| `GET` | `/api/v1/backup` | Baixa o backup do MySQL em JSON |
| `GET` | `/api/v1/logs/exportar-xml` | Baixa a auditoria do MongoDB em XML |
| `GET` | `/api/v1/relatorios/pdf/:idPaciente` | Gera o relatório clínico do paciente em PDF |

---

## Como Rodar o Projeto

### 1. Requisitos

* Node.js
* XAMPP (Apache e MySQL)
* MongoDB Community Server

### 2. Instalação e Execução

```bash
# 1. Clone o repositório e navegue até a pasta
git clone https://github.com/romulolpaula/Projeto-MArrOM
cd Projeto-MArrOM

# 2. Instale as dependências do Node.js
npm install

# 3. Configure o Banco de Dados Relacional
# Inicie o módulo MySQL no XAMPP e importe o script de tabelas no phpMyAdmin

# 4. Inicialize o ecossistema (rode cada comando em um terminal separado)
node Server.js        # Inicializa o servidor base do sistema
node app.js           # Inicializa a API Express e conexões com os bancos
node monitor_mqtt.js  # Inicializa o escutador de telemetria do ESP32
```
