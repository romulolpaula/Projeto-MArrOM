const express = require("express");
const cors = require("cors");

const JwtMiddleware = require("./middleware/JwtMiddleware");
const PacienteMiddleware = require("./middleware/PacienteMiddleware");
const LeituraMiddleware = require("./middleware/LeituraMiddleware");
const SensorVinculoMiddleware = require("./middleware/SensorVinculoMiddleware");
const AutenticacaoMiddleware = require("./middleware/AutenticacaoMiddleware");
const LogMiddleware = require("./middleware/LogMiddleware");
const ErrorMiddleware = require("./middleware/ErrorMiddleware");

const PacienteControl = require("./control/PacienteControl");
const LeituraControl = require("./control/LeituraControl");
const SensorVinculoControl = require("./control/SensorVinculoControl");
const AutenticacaoControl = require("./control/AutenticacaoControl");
const LogController = require("./control/LogController");
const TipoFeridaControl = require("./control/TipoFeridaControl");
const BackupControl = require("./control/BackupControl");

const PacienteService = require("./service/PacienteService");
const LeituraService = require("./service/LeituraService");
const SensorVinculoService = require("./service/SensorVinculoService");
const UsuarioService = require("./service/UsuarioService");
const LogService = require("./service/LogService");
const TipoFeridaService = require("./service/TipoFeridaService");
const PacienteFeridaService = require("./service/PacienteFeridaService");

const PacienteDAO = require("./dao/PacienteDAO");
const LeituraDAO = require("./dao/LeituraDAO");
const SensorVinculoDAO = require("./dao/SensorVinculoDAO");
const UsuarioDAO = require("./dao/UsuarioDAO");
const LogDAO = require("./dao/LogDAO");
const TipoFeridaDAO = require("./dao/TipoFeridaDAO");
const PacienteFeridaDAO = require("./dao/PacienteFeridaDAO");

const MysqlDatabase = require("./database/MySqlDataBase");
const MongoDatabase = require("./database/MongoDatabase");

const PacienteRoteador = require("./router/PacienteRoteador");
const LeituraRoteador = require("./router/LeituraRoteador");
const SensorVinculoRoteador = require("./router/SensorVinculoRoteador");
const AutenticacaoRoteador = require("./router/AutenticacaoRoteador");
const LogRoteador = require("./router/LogRoteador");
const TipoFeridaRoteador = require("./router/TipoFeridaRoteador");
const PacienteFeridaRoteador = require("./router/PacienteFeridaRoteador");
const BackupRoteador = require("./router/BackupRoteador");

module.exports = class Server {
  #porta;
  #app;
  #mysqlDatabase;
  #mongoDatabase;

  #jwtMiddleware;
  #pacienteMiddleware;
  #leituraMiddleware;
  #sensorVinculoMiddleware;
  #authMiddleware;
  #logMiddleware;
  #errorMiddleware;

  #logDAO;
  #pacienteDAO;
  #leituraDAO;
  #sensorVinculoDAO;
  #usuarioDAO;
  #tipoFeridaDAO;
  #pacienteFeridaDAO;

  #logService;
  #pacienteService;
  #leituraService;
  #sensorVinculoService;
  #usuarioService;
  #tipoFeridaService;

  #logController;
  #pacienteControl;
  #leituraControl;
  #sensorVinculoControl;
  #autenticacaoControl;
  #tipoFeridaControl;
  #backupControl;

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

    this.#mysqlDatabase = new MysqlDatabase({
      host: "localhost",
      user: "root",
      password: "",
      database: "marrom_sistemadeacompanhamento",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 10,
    });
    await this.#mysqlDatabase.connect();

    this.#mongoDatabase = new MongoDatabase(
      "mongodb://localhost:27017",
      "marrom_logs",
    );
    await this.#mongoDatabase.connect();

    this.#logDAO = new LogDAO(this.#mongoDatabase);
    this.#logService = new LogService(this.#logDAO);
    this.#logMiddleware = new LogMiddleware(this.#logService);
    this.#errorMiddleware = new ErrorMiddleware(this.#logService);

    this.#app.use(this.#logMiddleware.registrar);

    this.#app.use((req, res, next) => {
      console.log(
        "------------------------------------------------------------------",
      );
      next();
    });

    this.setupAuth();
    this.setupPaciente();
    this.setupLeitura();
    this.setupSensorVinculo();
    this.setupLogs();

    // Chamadas das configurações novas!
    this.setupTipoFerida();
    this.setupPacienteFerida();
    this.setupBackup();

    this.#app.use(this.#errorMiddleware.handle);
  };

  setupAuth = () => {
    console.log("Server.setupAuth()");
    this.#authMiddleware = new AutenticacaoMiddleware();
    this.#usuarioDAO = new UsuarioDAO(this.#mysqlDatabase);
    this.#usuarioService = new UsuarioService(this.#usuarioDAO);
    this.#autenticacaoControl = new AutenticacaoControl(
      this.#usuarioService,
      this.#logService,
    );

    const roteadorAuth = express.Router();
    const autenticacaoRoteador = new AutenticacaoRoteador(
      roteadorAuth,
      this.#authMiddleware,
      this.#autenticacaoControl,
    );
    this.#app.use("/api/v1/funcionarios", autenticacaoRoteador.createRoutes());
  };

  setupPaciente = () => {
    console.log("Server.setupPaciente()");
    this.#pacienteMiddleware = new PacienteMiddleware();
    this.#pacienteDAO = new PacienteDAO(this.#mysqlDatabase);
    this.#pacienteService = new PacienteService(this.#pacienteDAO);
    this.#pacienteControl = new PacienteControl(this.#pacienteService);

    const roteadorPaciente = express.Router();
    const pacienteRoteador = new PacienteRoteador(
      roteadorPaciente,
      this.#jwtMiddleware,
      this.#pacienteMiddleware,
      this.#pacienteControl,
    );
    this.#app.use("/api/v1/pacientes", pacienteRoteador.createRoutes());
  };

  setupLeitura = () => {
    console.log("Server.setupLeitura()");
    this.#leituraMiddleware = new LeituraMiddleware();
    this.#leituraDAO = new LeituraDAO(this.#mysqlDatabase);
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
    this.#sensorVinculoDAO = new SensorVinculoDAO(this.#mysqlDatabase);
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

  setupLogs = () => {
    console.log("Server.setupLogs()");
    this.#logController = new LogController(this.#logService);

    const roteadorLog = express.Router();
    const logRoteador = new LogRoteador(
      roteadorLog,
      this.#jwtMiddleware,
      this.#logController,
    );
    this.#app.use("/api/v1/logs", logRoteador.createRoutes());
  };

  setupTipoFerida = () => {
    console.log("Server.setupTipoFerida()");
    this.#tipoFeridaDAO = new TipoFeridaDAO(this.#mysqlDatabase);
    this.#tipoFeridaService = new TipoFeridaService(this.#tipoFeridaDAO);
    this.#tipoFeridaControl = new TipoFeridaControl(this.#tipoFeridaService);

    const roteadorTipoFerida = express.Router();
    const tipoFeridaRoteador = new TipoFeridaRoteador(
      roteadorTipoFerida,
      this.#jwtMiddleware,
      this.#tipoFeridaControl,
    );
    this.#app.use("/api/v1/tipos-feridas", tipoFeridaRoteador.createRoutes());
  };

  setupPacienteFerida = () => {
    console.log("Server.setupPacienteFerida()");

    // ← aqui estava usando TipoFeridaService e TipoFeridaControl — ERRADO
    const PacienteFeridaService = require("./service/PacienteFeridaService");
    const PacienteFeridaControl = require("./control/PacienteFeridaControl");

    this.#pacienteFeridaDAO = new PacienteFeridaDAO(this.#mysqlDatabase);
    const pacienteFeridaService = new PacienteFeridaService(
      this.#pacienteFeridaDAO,
    );
    const pacienteFeridaControl = new PacienteFeridaControl(
      pacienteFeridaService,
    );

    const roteadorPacienteFerida = express.Router();
    const pacienteFeridaRoteador = new PacienteFeridaRoteador(
      roteadorPacienteFerida,
      this.#jwtMiddleware,
      pacienteFeridaControl,
    );

    this.#app.use(
      "/api/v1/pacientes-feridas",
      pacienteFeridaRoteador.createRoutes(),
    );
  };

  setupBackup = () => {
    console.log("Server.setupBackup()");
    this.#backupControl = new BackupControl(this.#mysqlDatabase);

    const roteadorBackup = express.Router();
    const backupRoteador = new BackupRoteador(
      roteadorBackup,
      this.#backupControl,
    );
    this.#app.use("/api/v1/backup", backupRoteador.createRoutes());
  };

  run = () => {
    this.#app.listen(this.#porta, () => {
      console.log(`Server rodando em http://localhost:${this.#porta}`);
    });
  };
};
