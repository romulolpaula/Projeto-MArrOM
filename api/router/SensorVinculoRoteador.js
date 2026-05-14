const express = require("express");

module.exports = class SensorVinculoRoteador {
  #router;
  #sensorVinculoControl;
  #jwtMiddleware;

  constructor(
    routerDependency,
    jwtMiddlewareDependency,
    sensorVinculoControlDependency,
  ) {
    console.log("⬆️  SensorVinculoRoteador.constructor()");
    this.#router = routerDependency;
    this.#jwtMiddleware = jwtMiddlewareDependency;
    this.#sensorVinculoControl = sensorVinculoControlDependency;
  }

  createRoutes = () => {
    console.log("SensorVinculoRoteador.createRoutes()");

    this.#router.put(
      "/:idSensor",
      this.#jwtMiddleware.validateToken,
      this.#sensorVinculoControl.update,
    );

    this.#router.get(
      "/:idSensor",
      this.#jwtMiddleware.validateToken,
      this.#sensorVinculoControl.show,
    );

    return this.#router;
  };
};
