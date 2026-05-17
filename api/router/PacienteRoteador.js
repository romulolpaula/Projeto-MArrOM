const express = require("express");

module.exports = class PacienteRoteador {
  #router;
  #pacienteControl;
  #jwtMiddleware;
  #pacienteMiddleware; // ← adiciona a dependência

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    pacienteMiddlewareDependency, // ← recebe o middleware
    pacienteControlDependency,
  ) {
    console.log("⬆️  PacienteRoteador.constructor()");
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#pacienteMiddleware = pacienteMiddlewareDependency; // ← salva
    this.#pacienteControl = pacienteControlDependency;
  }

  createRoutes = () => {
    console.log("⬆️  PacienteRoteador.createRoutes()");

    this.#router.post(
      "/",
      // this.#jwtMiddleware.validateToken,
      this.#pacienteMiddleware.validateBody, // ← valida o body antes
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
      this.#pacienteMiddleware.validateIdParam, // ← valida o id
      this.#pacienteControl.show,
    );

    return this.#router;
  };
};
