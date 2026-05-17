const Paciente = require("../model/Paciente");

module.exports = class PacienteDAO {
  #database;

  constructor(databaseInstance) {
    console.log("PacienteDAO.constructor()");
    this.#database = databaseInstance;
  }

  create = async (objPacienteModel) => {
    console.log("PacienteDAO.create()");

    const SQL = "INSERT INTO pacientes (nome) VALUES (?);";
    const params = [objPacienteModel.nome];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    if (!resultado.insertId) {
      throw new Error("Falha ao inserir paciente");
    }

    return resultado.insertId;
  };

  delete = async (objPacienteModel) => {
    console.log("PacienteDAO.delete()");

    const SQL = "DELETE FROM pacientes WHERE id = ?;";
    const params = [objPacienteModel.id];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    return resultado.affectedRows > 0;
  };

  update = async (objPacienteModel) => {
    console.log("PacienteDAO.update()");

    const SQL = "UPDATE pacientes SET nome = ? WHERE id = ?;";
    const params = [objPacienteModel.nome, objPacienteModel.id];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    return resultado.affectedRows > 0;
  };

  findAll = async () => {
    console.log("PacienteDAO.findAll()");

    const SQL = "SELECT * FROM pacientes;";
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL);

    return resultado;
  };

  findById = async (idPaciente) => {
    console.log("PacienteDAO.findById()");

    const SQL = "SELECT * FROM pacientes WHERE id = ?;";
    const params = [idPaciente];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    return resultado[0] || null;
  };
};
