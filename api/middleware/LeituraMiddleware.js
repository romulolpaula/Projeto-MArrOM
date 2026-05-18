const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class LeituraMiddleware {
  validateBody = (request, response, next) => {
    console.log("LeituraMiddleware.validateBody()");
    const body = request.body;

    if (!body.leitura) {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message: "O campo 'leitura' é obrigatório!",
      });
    }

    const { temperatura, umidade, idPaciente } = body.leitura;

    if (temperatura === undefined || umidade === undefined || !idPaciente) {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message:
          "Campos 'temperatura', 'umidade' e 'idPaciente' são obrigatórios!",
      });
    }

    next();
  };

  validateIdPacienteParam = (request, response, next) => {
    console.log("LeituraMiddleware.validateIdPacienteParam()");
    const { idPaciente } = request.params;

    if (!idPaciente) {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message: "O parâmetro 'idPaciente' é obrigatório!",
      });
    }

    next();
  };
};
