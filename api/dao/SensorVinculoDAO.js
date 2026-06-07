const IDAO = require("../interfaces/IDAO");
const SensorVinculo = require("../model/SensorVinculo");

module.exports = class SensorVinculoDAO extends IDAO {
  #database;

  constructor(databaseInstance) {
    super();
    console.log("SensorVinculoDAO.constructor()");
    this.#database = databaseInstance;
  }

  update = async (objVinculoModel) => {
    return await this.updateVinculo(objVinculoModel);
  };

  updateVinculo = async (objVinculoModel) => {
    console.log("SensorVinculoDAO.updateVinculo()");

    const SQL =
      "UPDATE sensores_vinculo SET id_paciente_atual = ? WHERE id_sensor = ?;";
    const params = [objVinculoModel.idPacienteAtual, objVinculoModel.idSensor];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    return resultado.affectedRows > 0;
  };

  findPacienteAtual = async (idSensor) => {
    console.log(`SensorVinculoDAO.findPacienteAtual() - Sensor: ${idSensor}`);

    const SQL =
      "SELECT id_paciente_atual FROM sensores_vinculo WHERE id_sensor = ?;";
    const params = [idSensor];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    if (resultado.length > 0) {
      return resultado[0].id_paciente_atual;
    }
    return null;
  };

  create = async (model) => {
    return 1;
  };
  findAll = async () => {
    return [];
  };
  findById = async (id) => {
    return await this.findPacienteAtual(id);
  };
  delete = async (model) => {
    return true;
  };
};
