const express = require("express");
const JwtMiddleware = require("../middleware/JwtMiddleware");
const LeituraMiddleware = require("../middleware/LeituraMiddleware");
const LeituraControl = require("../control/LeituraControl");

module.exports = class LeituraRoteador {
  #router;
  #leituraMiddleware;
  #leituraControl;
  #jwtMiddleware;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    leituraMiddlewareDependency,
    leituraControlDependency,
  ) {
    console.log("LeituraRoteador.constructor()");
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#leituraMiddleware = leituraMiddlewareDependency;
    this.#leituraControl = leituraControlDependency;
  }

  createRoutes = () => {
    console.log("⬆️  LeituraRoteador.createRoutes()");

    // Rota onde o sensor salva os dados (Já estava sem JWT)
    this.#router.post(
      "/",
      this.#leituraMiddleware.validateBody,
      this.#leituraControl.store,
    );

    // Rota onde o HTML busca os dados para o gráfico (Comentamos o JWT)
    this.#router.get(
      "/paciente/:idPaciente",
      // this.#jwtMiddleware.validateToken, <--- COMENTADO PARA TESTE!
      this.#leituraMiddleware.validateIdPacienteParam,
      this.#leituraControl.show,
    );

    return this.#router;
  };
};
