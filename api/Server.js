const express = require("express");
const cors = require("cors");
const ErrorResponse = require("./utils/ErrorResponse"); // Ajuste a pasta se necessário

// Middlewares Globais/Específicos
const JwtMiddleware = require("./middleware/JwtMiddleware");
const PacienteMiddleware = require("./middleware/PacienteMiddleware");
const LeituraMiddleware = require("./middleware/LeituraMiddleware");
const SensorVinculoMiddleware = require("./middleware/SensorVinculoMiddleware");

// Controllers
const PacienteControl = require("./control/PacienteControl");
const LeituraControl = require("./control/LeituraControl");
const SensorVinculoControl = require("./control/SensorVinculoControl");

// Services
const PacienteService = require("./service/PacienteService");
const LeituraService = require("./service/LeituraService");
const SensorVinculoService = require("./service/SensorVinculoService");

// DAOs
const PacienteDAO = require("./dao/PacienteDAO");
const LeituraDAO = require("./dao/LeituraDAO");
const SensorVinculoDAO = require("./dao/SensorVinculoDAO");

// Banco de dados
const MysqlDatabase = require("./database/MysqlDatabase");

// Roteadores
const PacienteRoteador = require("./router/PacienteRoteador");
const LeituraRoteador = require("./router/LeituraRoteador");
const SensorVinculoRoteador = require("./router/SensorVinculoRoteador");

module.exports = class Server {
  #porta;
  #app;
  #database;

  #jwtMiddleware;
  #pacienteMiddleware;
  #leituraMiddleware;
  #sensorVinculoMiddleware;

  #pacienteDAO;
  #leituraDAO;
  #sensorVinculoDAO;

  #pacienteService;
  #leituraService;
  #sensorVinculoService;

  #pacienteControl;
  #leituraControl;
  #sensorVinculoControl;

  constructor(porta) {
    console.log("Server.constructor()");
    this.#porta = porta ?? 3000;
  }

  init = async () => {
    console.log("Server.init()");
    this.#app = express();
    this.#app.use(cors());

    this.#app.use(express.json());
    this.#app.use(express.static("public"));

    this.#jwtMiddleware = new JwtMiddleware();

    this.#database = new MysqlDatabase({
      host: "localhost",
      user: "root",
      password: "",
      database: "marrom_sistemadeacompanhamento",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 10,
    });

    await this.#database.connect();

    this.beforeRouting();

    this.setupPaciente();
    this.setupLeitura();
    this.setupSensorVinculo();

    this.setupErrorHandler();
  };

  setupPaciente = () => {
    this.#pacienteMiddleware = new PacienteMiddleware();
    this.#pacienteDAO = new PacienteDAO(this.#database);
    this.#pacienteService = new PacienteService(this.#pacienteDAO);
    this.#pacienteControl = new PacienteControl(this.#pacienteService);

    const roteadorPaciente = express.Router();

    const pacienteRoteador = new PacienteRoteador(
      roteadorPaciente,
      this.#jwtMiddleware,
      this.#pacienteMiddleware, // ← passa o middleware aqui
      this.#pacienteControl,
    );
    this.#app.use("/api/v1/pacientes", pacienteRoteador.createRoutes());
  };

  setupLeitura = () => {
    console.log("Server.setupLeitura()");
    this.#leituraMiddleware = new LeituraMiddleware();
    this.#leituraDAO = new LeituraDAO(this.#database);
    this.#leituraService = new LeituraService(this.#leituraDAO);
    this.#leituraControl = new LeituraControl(this.#leituraService);

    const roteadorLeitura = express.Router();

    const leituraRoteador = new LeituraRoteador(
      roteadorLeitura,
      this.#jwtMiddleware,
      this.#leituraMiddleware,
      this.#leituraControl,
    );
    this.#app.use("/api/v1/leituras", leituraRoteador.createRoutes());
  };

  setupSensorVinculo = () => {
    console.log("Server.setupSensorVinculo()");
    this.#sensorVinculoMiddleware = new SensorVinculoMiddleware();
    this.#sensorVinculoDAO = new SensorVinculoDAO(this.#database);

    this.#sensorVinculoService = new SensorVinculoService(
      this.#sensorVinculoDAO,
      this.#pacienteDAO,
    );
    this.#sensorVinculoControl = new SensorVinculoControl(
      this.#sensorVinculoService,
    );

    const roteadorSensor = express.Router();

    const sensorRoteador = new SensorVinculoRoteador(
      roteadorSensor,
      this.#jwtMiddleware,
      this.#sensorVinculoControl,
    );
    this.#app.use("/api/v1/vinculos", sensorRoteador.createRoutes());
  };

  beforeRouting = () => {
    this.#app.use((req, res, next) => {
      console.log(
        "------------------------------------------------------------------",
      );
      next();
    });
  };

  setupErrorHandler = () => {
    console.log("Server.setupErrorHandler()");
    this.#app.use((error, request, response, next) => {
      if (error instanceof ErrorResponse) {
        console.log("Server.errorHandler()");
        return response.status(error.httpCode).json({
          success: false,
          message: error.message,
          error: error.error,
        });
      }

      const resposta = {
        success: false,
        message: "Ocorreu um erro interno no servidor",
        data: { stack: error.stack },
        error: { message: error.message || "Erro interno", code: error.code },
      };
      console.error("Erro capturado:", resposta);
      response.status(500).json(resposta);
    });
  };

  run = () => {
    this.#app.listen(this.#porta, () => {
      console.log(`Server rodando em http://localhost:${this.#porta}`);
    });
  };
};
