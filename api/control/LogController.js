const IController = require("../interfaces/IController");

module.exports = class LogController extends IController {
  #logService;

  constructor(logServiceDependency) {
    super();
    this.#logService = logServiceDependency;
  }

  index = async (request, response, next) => {
    try {
      const { usuario, dataInicio, dataFim, acao, limite } = request.query;

      const logs = await this.#logService.buscarLogs({
        usuario,
        dataInicio,
        dataFim,
        acao,
        limite: limite ? parseInt(limite) : 200,
      });

      return response.status(200).json({
        success: true,
        message: `${logs.length} log(s) encontrado(s)`,
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  };

  exportarXML = async (request, response, next) => {
    try {
      const { usuario, dataInicio, dataFim, acao } = request.query;

      const xml = await this.#logService.gerarXML({
        usuario,
        dataInicio,
        dataFim,
        acao,
      });

      const nomeArquivo = `logs_${new Date().toISOString().slice(0, 10)}.xml`;

      response.setHeader("Content-Type", "application/xml; charset=utf-8");
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="${nomeArquivo}"`,
      );
      return response.status(200).send(xml);
    } catch (error) {
      next(error);
    }
  };

  store = async (request, response, next) => {
    response.status(501).send();
  };
  show = async (request, response, next) => {
    return await this.exportarXML(request, response, next);
  };
  update = async (request, response, next) => {
    response.status(501).send();
  };
  destroy = async (request, response, next) => {
    response.status(501).send();
  };
};
