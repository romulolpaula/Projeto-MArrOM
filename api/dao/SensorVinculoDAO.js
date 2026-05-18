const SensorVinculo = require("../model/SensorVinculo");

module.exports = class SensorVinculoDAO {
  #database;

  constructor(databaseInstance) {
    console.log("SensorVinculoDAO.constructor()");
    this.#database = databaseInstance;
  }

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
};
