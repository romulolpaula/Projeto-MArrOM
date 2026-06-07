const IDAO = require("../interfaces/IDAO");

module.exports = class PacienteFeridaDAO extends IDAO {
  #database;

  constructor(databaseInstance) {
    super();
    console.log("PacienteFeridaDAO.constructor()");
    this.#database = databaseInstance;
  }

  create = async (objPacienteFeridaModel) => {
    console.log("PacienteFeridaDAO.create()");
    const SQL =
      "INSERT INTO pacientes_feridas (id_paciente, id_tipo_ferida) VALUES (?, ?);";
    const params = [
      objPacienteFeridaModel.id_paciente,
      objPacienteFeridaModel.id_tipo_ferida,
    ];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    if (resultado.affectedRows === 0) {
      throw new Error("Falha ao vincular ferida ao paciente");
    }

    return {
      id_paciente: objPacienteFeridaModel.id_paciente,
      id_tipo_ferida: objPacienteFeridaModel.id_tipo_ferida,
    };
  };

  findByPacienteId = async (idPaciente) => {
    return await this.findById(idPaciente);
  };

  findById = async (idPaciente) => {
    console.log("PacienteFeridaDAO.findById()");
    const SQL = `
      SELECT tf.* FROM tipos_feridas tf
      INNER JOIN pacientes_feridas pf ON tf.id = pf.id_tipo_ferida
      WHERE pf.id_paciente = ?;
    `;
    const params = [idPaciente];
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);
    return resultado;
  };

  findAll = async () => {
    console.log("PacienteFeridaDAO.findAll()");
    const SQL = "SELECT * FROM pacientes_feridas;";
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL);
    return resultado;
  };

  delete = async (objPacienteFeridaModel) => {
    console.log("PacienteFeridaDAO.delete()");
    const SQL =
      "DELETE FROM pacientes_feridas WHERE id_paciente = ? AND id_tipo_ferida = ?;";
    const params = [
      objPacienteFeridaModel.id_paciente,
      objPacienteFeridaModel.id_tipo_ferida,
    ];
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);
    return resultado.affectedRows > 0;
  };
};
