const MeuTokenJWT = require("../http/MeuTokenJWT");

module.exports = class LogMiddleware {
  #logService;

  constructor(logServiceDependency) {
    this.#logService = logServiceDependency;
  }

  registrar = (request, response, next) => {
    const inicio = Date.now();
    const metodo = request.method;
    const endpoint = request.originalUrl;
    const ip =
      request.ip || request.headers["x-forwarded-for"] || "desconhecido";
    const userAgent = request.headers["user-agent"] || "";

    let nomeUsuario = "anonimo";
    try {
      const authorization = request.headers.authorization;
      if (authorization) {
        const jwt = new MeuTokenJWT();
        if (jwt.validarToken(authorization)) {
          nomeUsuario =
            jwt.payload?.email || jwt.payload?.name || "autenticado";
        }
      }
    } catch (_) {}

    const originalJson = response.json.bind(response);
    response.json = (body) => {
      const tempoResposta = Date.now() - inicio;
      const statusCode = response.statusCode;

      this.#logService
        .logAcesso({
          usuario: nomeUsuario,
          ip,
          userAgent,
          endpoint,
          metodo,
          statusCode,
          tempoResposta,
        })
        .catch((err) =>
          console.error("[LogMiddleware] Erro ao logar:", err.message),
        );

      return originalJson(body);
    };

    next();
  };

  get logService() {
    return this.#logService;
  }
};
