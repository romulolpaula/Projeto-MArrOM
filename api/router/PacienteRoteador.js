const express = require("express");

module.exports = class PacienteRoteador {
  #router;
  #pacienteControl;
  #jwtMiddleware;
  #pacienteMiddleware;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    pacienteMiddlewareDependency,
    pacienteControlDependency,
  ) {
    console.log("PacienteRoteador.constructor()");
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#pacienteMiddleware = pacienteMiddlewareDependency;
    this.#pacienteControl = pacienteControlDependency;
  }

  createRoutes = () => {
    console.log("PacienteRoteador.createRoutes()");

    this.#router.post(
      "/",
      // this.#jwtMiddleware.validateToken,
      this.#pacienteMiddleware.validateBody,
      this.#pacienteControl.store,
    );

    this.#router.get(
      "/",
      // this.#jwtMiddleware.validateToken,
      this.#pacienteControl.index,
    );

    this.#router.get(
      "/:id",
      // this.#jwtMiddleware.validateToken,
      this.#pacienteMiddleware.validateIdParam,
      this.#pacienteControl.show,
    );

    return this.#router;
  };
};
