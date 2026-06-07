const IService = require("../interfaces/IService");

module.exports = class TipoFeridaService extends IService {
  #tipoFeridaDAO;

  constructor(tipoFeridaDAOInstance) {
    super();
    this.#tipoFeridaDAO = tipoFeridaDAOInstance;
  }

  create = async (objTipoFeridaModel) => {
    if (!objTipoFeridaModel.nome) {
      throw new Error("O nome do tipo de ferida é obrigatório.");
    }
    return await this.#tipoFeridaDAO.create(objTipoFeridaModel);
  };

  findAll = async () => {
    return await this.#tipoFeridaDAO.findAll();
  };

  findById = async (id) => {
    return await this.#tipoFeridaDAO.findById(id);
  };

  update = async (id, dados) => {
    const objModel = { id, ...dados };
    return await this.#tipoFeridaDAO.update(objModel);
  };

  delete = async (id) => {
    const objModel = { id };
    return await this.#tipoFeridaDAO.delete(objModel);
  };
};
