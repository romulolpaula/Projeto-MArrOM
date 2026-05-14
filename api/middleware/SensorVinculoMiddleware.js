const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class SensorVinculoMiddleware {
  validateUpdate = (request, response, next) => {
    console.log("🔷 SensorVinculoMiddleware.validateUpdate()");

    if (!request.params.idSensor) {
      throw new ErrorResponse(400, "Erro na validação", {
        message: "ID do sensor é obrigatório na URL",
      });
    }

    if (!request.body.idPaciente) {
      throw new ErrorResponse(400, "Erro na validação", {
        message: "ID do novo paciente é obrigatório no corpo da requisição",
      });
    }

    next();
  };
};
