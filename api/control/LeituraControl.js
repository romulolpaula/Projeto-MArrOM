const IController = require("../interfaces/IController");
const LeituraService = require("../service/LeituraService");

module.exports = class LeituraControl extends IController {
  #leituraService;

  constructor(leituraServiceDependency) {
    super();
    console.log("LeituraControl.constructor()");
    this.#leituraService = leituraServiceDependency;
  }

  store = async (request, response, next) => {
    console.log("LeituraControl.store()");
    try {
      const leituraBodyRequest = request.body.leitura;

      const novoId =
        await this.#leituraService.createLeitura(leituraBodyRequest);

      const objResposta = {
        success: true,
        message: "Leitura registrada com sucesso",
        data: {
          leituras: [
            {
              idLeitura: novoId,
              idPaciente: leituraBodyRequest.idPaciente,
              temperatura: leituraBodyRequest.temperatura,
              umidade: leituraBodyRequest.umidade,
            },
          ],
        },
      };

      if (novoId) {
        response.status(201).send(objResposta);
      } else {
        throw new Error("Falha ao registrar nova Leitura");
      }
    } catch (error) {
      next(error);
    }
  };

  show = async (request, response, next) => {
    console.log("LeituraControl.show()");
    try {
      const pacienteId = request.params.idPaciente;

      const historico =
        await this.#leituraService.findRecentByPaciente(pacienteId);

      const objResposta = {
        success: true,
        message: "Histórico recuperado com sucesso",
        data: {
          leituras: historico,
        },
      };

      response.status(200).send(objResposta);
    } catch (error) {
      next(error);
    }
  };

  index = async (request, response, next) => {
    response.status(501).send();
  };
  update = async (request, response, next) => {
    response.status(501).send();
  };
  destroy = async (request, response, next) => {
    response.status(501).send();
  };
};
