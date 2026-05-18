module.exports = class UsuarioDAO {
  #database;

  constructor(databaseInstance) {
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
};
