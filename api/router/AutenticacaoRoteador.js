module.exports = class AuthRoteador {
  #router;
  #authMiddleware;
  #authControl;

  constructor(
    routerDependency,
    authMiddlewareDependency,
    authControlDependency,
  ) {
    console.log("AuthRoteador.constructor()");
    this.#router = routerDependency;
    this.#authMiddleware = authMiddlewareDependency;
    this.#authControl = authControlDependency;
  }

  createRoutes = () => {
    console.log("AuthRoteador.createRoutes()");

    this.#router.post(
      "/login",
      this.#authMiddleware.validateBody,
      this.#authControl.login,
    );

    return this.#router;
  };
};
