const express = require("express");
const TipoFeridaDAO = require("../dao/TipoFeridaDAO");
const TipoFeridaService = require("../service/TipoFeridaService");
const TipoFeridaControl = require("../control/TipoFeridaControl");

module.exports = class TipoFeridaRoteador {
  #router;
  #jwtMiddleware;
  #control;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    tipoFeridaControlDependency,
  ) {
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#control = tipoFeridaControlDependency;
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
      "/:id",
      this.#jwtMiddleware.validateToken,
      this.#control.update,
    );
    this.#router.delete(
      "/:id",
      this.#jwtMiddleware.validateToken,
      this.#control.destroy,
    );
    return this.#router;
  }
};
