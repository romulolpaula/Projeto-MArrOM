const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class PacienteMiddleware {
  validateBody = (request, response, next) => {
    console.log("PacienteMiddleware.validateBody()");
    const body = request.body;

    if (!body.paciente) {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message: "O campo 'paciente' é obrigatório!",
      });
    }

    if (!body.paciente.nome || body.paciente.nome.trim() === "") {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message: "O nome do paciente é obrigatório!",
      });
    }

    next();
  };

  validateIdParam = (request, response, next) => {
    console.log("PacienteMiddleware.validateIdParam()");
    const { id } = request.params;

    if (!id) {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message: "O parâmetro 'id' é obrigatório!",
      });
    }

    next();
  };
};
