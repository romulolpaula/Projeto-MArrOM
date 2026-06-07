const express = require("express");
const BackupControl = require("../control/BackupControl");

module.exports = class BackupRoteador {
  #router;
  #control;

  constructor(routerDependency, backupControlDependency) {
    this.#router = routerDependency;
    this.#control = backupControlDependency;
  }

  createRoutes() {
    this.#router.get("/exportar", this.#control.exportarJSON);
    this.#router.post("/importar", this.#control.importarJSON);
    return this.#router;
  }
};
