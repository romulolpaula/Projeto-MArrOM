const express = require("express");

/**
 * Classe responsável por configurar as rotas de vinculação (Modo Teste - Sem JWT).
 */
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
    console.log("⬆️  SensorVinculoRoteador.createRoutes()");

    // PUT "/api/v1/vinculos/:idSensor" -> Associa o sensor a um novo ID de paciente
    this.#router.put(
      "/:idSensor",
      // this.#jwtMiddleware.validateToken, <-- COMENTADO PARA TESTE
      this.#sensorVinculoControl.update,
    );

    // GET "/api/v1/vinculos/:idSensor" -> Consulta quem está usando o sensor agora
    this.#router.get(
      "/:idSensor",
      // this.#jwtMiddleware.validateToken, <-- COMENTADO PARA TESTE
      this.#sensorVinculoControl.show,
    );

    return this.#router;
  };
};
