const express = require("express");
const PacienteFeridaDAO = require("../dao/PacienteFeridaDAO");

const PacienteFeridaControl = require("../control/PacienteFeridaControl");

module.exports = class PacienteFeridaRoteador {
  #router;
  #jwtMiddleware;
  #control;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    pacienteFeridaControlDependency,
  ) {
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#control = pacienteFeridaControlDependency;
  }

  createRoutes() {
    this.#router.get(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#control.index,
    );
    this.#router.get(
      "/:id",
      this.#jwtMiddleware.validateToken,
      this.#control.show,
    );
    this.#router.post(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#control.store,
    );
    this.#router.put(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#control.update,
    );
    this.#router.delete(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#control.destroy,
    );
    return this.#router;
  }
};
