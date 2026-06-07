const IDAO = require("../interfaces/IDAO");

module.exports = class UsuarioDAO extends IDAO {
  #database;

  constructor(databaseInstance) {
    super();
    console.log("UsuarioDAO.constructor()");
    this.#database = databaseInstance;
  }

  findByEmail = async (email) => {
    console.log(`UsuarioDAO.findByEmail() - Buscando: ${email}`);

    const SQL =
      "SELECT id, nome, email, senha FROM usuarios WHERE email = ? LIMIT 1;";
    const params = [email];

    const pool = await this.#database.getPool();
    const [resultado] = await pool.execute(SQL, params);

    return resultado || [];
  };

  create = async (model) => {
    const pool = await this.#database.getPool();
    const [res] = await pool.execute(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?);",
      [model.nome, model.email, model.senha],
    );
    return res.insertId;
  };
  findAll = async () => {
    const pool = await this.#database.getPool();
    const [res] = await pool.execute("SELECT id, nome, email FROM usuarios;");
    return res;
  };
  findById = async (id) => {
    const pool = await this.#database.getPool();
    const [res] = await pool.execute(
      "SELECT id, nome, email FROM usuarios WHERE id = ?;",
      [id],
    );
    return res[0] || null;
  };
  update = async (model) => {
    return true;
  };
  delete = async (model) => {
    return true;
  };
};
