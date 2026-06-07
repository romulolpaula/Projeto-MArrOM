const IDAO = require("../interfaces/IDAO");

module.exports = class TipoFeridaDAO extends IDAO {
  #database;

  constructor(databaseInstance) {
    super();
    console.log("TipoFeridaDAO.constructor()");
    this.#database = databaseInstance;
  }

  create = async (objTipoFeridaModel) => {
    console.log("TipoFeridaDAO.create()");
    const SQL = "INSERT INTO tipos_feridas (nome, descricao) VALUES (?, ?);";
    const params = [objTipoFeridaModel.nome, objTipoFeridaModel.descricao];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    if (!resultado.insertId) {
      throw new Error("Falha ao inserir tipo de ferida");
    }
    return resultado.insertId;
  };

  findAll = async () => {
    console.log("TipoFeridaDAO.findAll()");
    const SQL = "SELECT * FROM tipos_feridas;";
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL);
    return resultado;
  };

  findById = async (idTipoFerida) => {
    console.log("TipoFeridaDAO.findById()");
    const SQL = "SELECT * FROM tipos_feridas WHERE id = ?;";
    const params = [idTipoFerida];
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);
    return resultado[0] || null;
  };

  update = async (objTipoFeridaModel) => {
    console.log("TipoFeridaDAO.update()");
    const SQL =
      "UPDATE tipos_feridas SET nome = ?, descricao = ? WHERE id = ?;";
    const params = [
      objTipoFeridaModel.nome,
      objTipoFeridaModel.descricao,
      objTipoFeridaModel.id,
    ];
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);
    return resultado.affectedRows > 0;
  };

  delete = async (objTipoFeridaModel) => {
    console.log("TipoFeridaDAO.delete()");
    const SQL = "DELETE FROM tipos_feridas WHERE id = ?;";
    const params = [objTipoFeridaModel.id];
    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);
    return resultado.affectedRows > 0;
  };
};
