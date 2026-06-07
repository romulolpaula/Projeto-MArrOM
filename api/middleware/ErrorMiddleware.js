const ErrorResponse = require("../utils/ErrorResponse");

module.exports = class ErrorMiddleware {
  #logService;

  constructor(logServiceDependency) {
    this.#logService = logServiceDependency;
  }

  handle = (error, request, response, next) => {
    const metodo = request.method;
    const endpoint = request.originalUrl;
    const ip = request.ip || "desconhecido";

    let usuario = "desconhecido";
    try {
      const MeuTokenJWT = require("../http/MeuTokenJWT");
      const jwt = new MeuTokenJWT();
      if (jwt.validarToken(request.headers.authorization)) {
        usuario = jwt.payload?.email || "autenticado";
      }
    } catch (_) {}

    if (error instanceof ErrorResponse) {
      this.#logService
        ?.logErro({
          usuario,
          ip,
          endpoint,
          metodo,
          erro: error.message,
          stackTrace: null,
        })
        .catch(() => {});

      return response.status(error.httpCode).json({
        success: false,
        message: error.message,
        error: error.error,
      });
    }

    this.#logService
      ?.logErro({
        usuario,
        ip,
        endpoint,
        metodo,
        erro: error.message || "Erro interno",
        stackTrace: error.stack,
      })
      .catch(() => {});

    console.error(
      `[ErrorMiddleware] Erro interno em ${metodo} ${endpoint}:`,
      error,
    );

    return response.status(500).json({
      success: false,
      message: "Ocorreu um erro interno no servidor.",
      error: {
        message: error.message || "Erro desconhecido",
        code: error.code || "INTERNAL_ERROR",
      },
    });
  };
};
