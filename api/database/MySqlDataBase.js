const mysql = require("mysql2/promise");

module.exports = class MysqlDatabase {
  static #pool;

  #host;
  #user;
  #password;
  #database;
  #port;
  #waitForConnections;
  #connectionLimit;
  #queueLimit;

  constructor(config = {}) {
    this.#host = config.host || "localhost";
    this.#user = config.user || "root";
    this.#password = config.password || "";
    this.#database = config.database || "marrom_db";
    this.#port = config.port || 3306;
    this.#waitForConnections = config.waitForConnections ?? true;
    this.#connectionLimit = config.connectionLimit || 10;
    this.#queueLimit = config.queueLimit || 10;
  }

  async connect() {
    if (!MysqlDatabase.#pool) {
      MysqlDatabase.#pool = mysql.createPool({
        host: this.#host,
        user: this.#user,
        password: this.#password,
        database: this.#database,
        port: this.#port,
        waitForConnections: this.#waitForConnections,
        connectionLimit: this.#connectionLimit,
        queueLimit: this.#queueLimit,
      });

      try {
        const connection = await MysqlDatabase.#pool.getConnection();
        console.log("Conectado ao MySQL com sucesso!");
        connection.release();
      } catch (error) {
        console.error("Falha ao conectar ao MySQL:", error.message);
        process.exit(1);
      }
    }
    return MysqlDatabase.#pool;
  }

  async getPool() {
    return await this.connect();
  }
};
