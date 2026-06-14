const { MongoClient } = require("mongodb");

module.exports = class MongoDatabase {
  static #client = null;
  static #db = null;

  #uri;
  #dbName;

  constructor(uri = "mongodb://localhost:27017", dbName = "nome do banco") {
    this.#uri = uri;
    this.#dbName = dbName;
  }

  async connect() {
    if (!MongoDatabase.#client) {
      try {
        MongoDatabase.#client = new MongoClient(this.#uri);
        await MongoDatabase.#client.connect();
        MongoDatabase.#db = MongoDatabase.#client.db(this.#dbName);
        console.log(`Conectado ao MongoDB: ${this.#dbName}`);
      } catch (error) {
        console.error("Falha ao conectar ao MongoDB:", error.message);
        MongoDatabase.#client = null;
      }
    }
    return MongoDatabase.#db;
  }

  async getDb() {
    if (!MongoDatabase.#db) {
      await this.connect();
    }
    return MongoDatabase.#db;
  }

  async getCollection(collectionName) {
    const db = await this.getDb();
    if (!db) return null;
    return db.collection(collectionName);
  }

  isConnected() {
    return MongoDatabase.#client !== null && MongoDatabase.#db !== null;
  }
};
