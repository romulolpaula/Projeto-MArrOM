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
    console.log("LeituraRoteador.createRoutes()");

    this.#router.post(
      "/",
      this.#leituraMiddleware.validateBody,
      this.#leituraControl.store,
    );

    this.#router.get(
      "/paciente/:idPaciente",
      this.#jwtMiddleware.validateToken,
      this.#leituraMiddleware.validateIdPacienteParam,
      this.#leituraControl.show,
    );

    return this.#router;
  };
};
