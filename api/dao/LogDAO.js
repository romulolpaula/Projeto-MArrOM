const IDAO = require("../interfaces/IDAO");

module.exports = class LogDAO extends IDAO {
  #mongo;
  #colecao = "logs";

  constructor(mongoDatabaseInstance) {
    super();
    this.#mongo = mongoDatabaseInstance;
  }

  create = async (logDoc) => {
    return await this.inserir(logDoc);
  };

  inserir = async (logDoc) => {
    try {
      const collection = await this.#mongo.getCollection(this.#colecao);
      if (!collection) return;
      await collection.insertOne({ ...logDoc, timestamp: new Date() });
    } catch (err) {
      console.error("[LogDAO] Falha ao inserir log:", err.message);
    }
  };

  findAll = async () => {
    return await this.buscar();
  };

  buscar = async (filtros = {}) => {
    try {
      const collection = await this.#mongo.getCollection(this.#colecao);
      if (!collection) return [];

      const query = {};

      if (filtros.usuario) {
        query.usuario = { $regex: filtros.usuario, $options: "i" };
      }

      if (filtros.dataInicio || filtros.dataFim) {
        query.timestamp = {};
        if (filtros.dataInicio)
          query.timestamp.$gte = new Date(filtros.dataInicio);
        if (filtros.dataFim) query.timestamp.$lte = new Date(filtros.dataFim);
      }

      if (filtros.acao) {
        query.acao = filtros.acao;
      }

      return await collection
        .find(query)
        .sort({ timestamp: -1 })
        .limit(filtros.limite || 500)
        .toArray();
    } catch (err) {
      console.error("[LogDAO] Falha ao buscar logs:", err.message);
      return [];
    }
  };

  findById = async (id) => {
    return null;
  };
  update = async (model) => {
    return true;
  };
  delete = async (model) => {
    return true;
  };
};
