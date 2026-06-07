const IDAO = require("../interfaces/IDAO");
const Leitura = require("../model/Leitura");

module.exports = class LeituraDAO extends IDAO {
  #database;

  constructor(databaseInstance) {
    super();
    console.log("LeituraDAO.constructor()");
    this.#database = databaseInstance;
  }

  create = async (objLeituraModel) => {
    console.log("LeituraDAO.create()");

    const SQL =
      "INSERT INTO leituras (id_sensor, id_paciente, temperatura, umidade) VALUES (?, ?, ?, ?);";
    const params = [
      objLeituraModel.idSensor,
      objLeituraModel.idPaciente,
      objLeituraModel.temperatura,
      objLeituraModel.umidade,
    ];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    if (!resultado.insertId) {
      throw new Error("Falha ao registrar leitura no banco de dados.");
    }

    return resultado.insertId;
  };

  findRecentByPaciente = async (idPaciente, limite = 10) => {
    console.log(`LeituraDAO.findRecentByPaciente() - Paciente: ${idPaciente}`);

    const SQL =
      "SELECT temperatura, umidade, data_hora FROM leituras WHERE id_paciente = ? ORDER BY data_hora DESC LIMIT ?;";

    const params = [idPaciente, String(limite)];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    return resultado || [];
  };

  findAll = async () => {
    return [];
  };
  findById = async (id) => {
    return await this.findRecentByPaciente(id);
  };
  update = async (model) => {
    return true;
  };
  delete = async (model) => {
    return true;
  };
};
