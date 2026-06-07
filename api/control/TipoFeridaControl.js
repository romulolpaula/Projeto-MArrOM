const IController = require("../interfaces/IController");

module.exports = class TipoFeridaControl extends IController {
  #tipoFeridaService;

  constructor(tipoFeridaServiceInstance) {
    super();
    this.#tipoFeridaService = tipoFeridaServiceInstance;
  }

  index = async (request, response, next) => {
    try {
      const resultado = await this.#tipoFeridaService.findAll();
      return response.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  store = async (request, response, next) => {
    try {
      const novoId = await this.#tipoFeridaService.create(request.body);
      return response
        .status(201)
        .json({ id: novoId, mensagem: "Tipo de ferida criado!" });
    } catch (error) {
      next(error);
    }
  };

  show = async (request, response, next) => {
    try {
      const resultado = await this.#tipoFeridaService.findById(
        request.params.id,
      );
      if (!resultado)
        return response.status(404).json({ msg: "Não encontrado" });
      return response.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  update = async (request, response, next) => {
    try {
      const sucesso = await this.#tipoFeridaService.update(
        request.params.id,
        request.body,
      );
      return response.status(200).json({ sucesso });
    } catch (error) {
      next(error);
    }
  };

  destroy = async (request, response, next) => {
    try {
      const sucesso = await this.#tipoFeridaService.delete(request.params.id);
      return response.status(200).json({ sucesso });
    } catch (error) {
      next(error);
    }
  };
};
