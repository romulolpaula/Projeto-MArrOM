module.exports = class LogRoteador {
  #router;
  #jwtMiddleware;
  #logController;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    logControllerDependency,
  ) {
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#logController = logControllerDependency;
  }

  createRoutes = () => {
    this.#router.get(
      "/",
      this.#jwtMiddleware.validateToken,
      this.#logController.index,
    );

    this.#router.get(
      "/exportar-xml",
      this.#jwtMiddleware.validateToken,
      this.#logController.exportarXML,
    );

    return this.#router;
  };
};
