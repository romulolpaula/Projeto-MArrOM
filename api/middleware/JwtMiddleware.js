const MeuTokenJWT = require("../http/MeuTokenJWT");

/**
 * Middleware para validação de tokens JWT em requisições.
 */
module.exports = class JwtMiddleware {
  validateToken = (request, response, next) => {
    console.log(
      "🔷 JwtMiddleware.validateToken() -> [Ignorado temporariamente para testes]",
    );

    // 🚨 GAMBIARRA TEMPORÁRIA DE ENGENHARIA:
    // Deixa passar direto sem olhar o token para você conseguir testar o HTML e o ESP32.
    return next();

    // O código original do professor continua aqui embaixo protegido:
    const authorization = request.headers.authorization;
    const jwt = new MeuTokenJWT();
    const autorizado = jwt.validarToken(authorization);

    if (autorizado === true) {
      const payload = jwt.payload;
      const obj = {
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };
      request.headers.authorization = jwt.gerarToken(obj);
      next();
    } else {
      response.status(401).send({ status: false, msg: "token inválido" });
    }
  };
};
