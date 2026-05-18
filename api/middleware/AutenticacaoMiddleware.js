const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class AutenticacaoMiddleware {
  validateBody = (request, response, next) => {
    console.log("AuthMiddleware.validateBody()");
    const body = request.body;

    if (
      !body.funcionario ||
      !body.funcionario.email ||
      !body.funcionario.senha
    ) {
      throw new ErrorResponse(400, "Erro na validação de dados", {
        message: "O objeto 'funcionario' com 'email' e 'senha' é obrigatório!",
      });
    }

    next();
  };
};
