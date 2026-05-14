const express = require("express");
const MysqlDatabase = require("./database/MysqlDatabase");

const JwtMiddleware = require("./middleware/JwtMiddleware");
const PacienteMiddleware = require("./middleware/PacienteMiddleware");
const LeituraMiddleware = require("./middleware/LeituraMiddleware");
const SensorVinculoMiddleware = require("./middleware/SensorVinculoMiddleware");

const PacienteDAO = require("./dao/PacienteDAO");
const LeituraDAO = require("./dao/LeituraDAO");
const SensorVinculoDAO = require("./dao/SensorVinculoDAO");

const PacienteService = require("./service/PacienteService");
const LeituraService = require("./service/LeituraService");
const SensorVinculoService = require("./service/SensorVinculoService");

const PacienteControl = require("./control/PacienteControl");
const LeituraControl = require("./control/LeituraControl");
const SensorVinculoControl = require("./control/SensorVinculoControl");

const PacienteRoteador = require("./router/PacienteRoteador");
const LeituraRoteador = require("./router/LeituraRoteador");
const SensorVinculoRoteador = require("./router/SensorVinculoRoteador");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const database = new MysqlDatabase();

const pacienteDAO = new PacienteDAO(database);
const pacienteService = new PacienteService(pacienteDAO);
const pacienteControl = new PacienteControl(pacienteService);
const jwtMiddleware = new JwtMiddleware();
const pacienteMiddleware = new PacienteMiddleware();
const pacienteRoteador = new PacienteRoteador(
  express.Router(),
  jwtMiddleware,
  pacienteControl,
);
app.use("/api/v1/pacientes", pacienteRoteador.createRoutes());

const leituraDAO = new LeituraDAO(database);
const leituraService = new LeituraService(leituraDAO);
const leituraControl = new LeituraControl(leituraService);
const leituraMiddleware = new LeituraMiddleware();
const leituraRoteador = new LeituraRoteador(
  express.Router(),
  jwtMiddleware,
  leituraMiddleware,
  leituraControl,
);
app.use("/api/v1/leituras", leituraRoteador.createRoutes());

const sensorDAO = new SensorVinculoDAO(database);
const sensorService = new SensorVinculoService(sensorDAO);
const sensorControl = new SensorVinculoControl(sensorService);
const sensorMiddleware = new SensorVinculoMiddleware();
const sensorRoteador = new SensorVinculoRoteador(
  express.Router(),
  jwtMiddleware,
  sensorControl,
);
app.use("/api/v1/vinculos", sensorRoteador.createRoutes());

const porta = 3000;
app.listen(porta, () => {
  console.log(`🚀 API rodando no endereço: http://localhost:${porta}`);
});
