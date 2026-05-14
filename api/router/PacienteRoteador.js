const express = require("express");

module.exports = class PacienteRoteador {
  #router;
  #pacienteControl;
  #jwtMiddleware;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    pacienteControlDependency,
  ) {
    console.log("PacienteRoteador.constructor()");
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#pacienteControl = pacienteControlDependency;
  }

  createRoutes = () => {
    console.log("⬆PacienteRoteador.createRoutes()");

    this.#router.post(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#pacienteControl.store,
    );

    this.#router.get(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#pacienteControl.index,
    );

    this.#router.get(
      "/:id",
      this.#jwtMiddleware.validateToken,
      this.#pacienteControl.show,
    );

    return this.#router;
  };
};
