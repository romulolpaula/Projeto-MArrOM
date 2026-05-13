module.exports = class SensorVinculo {
  #idSensor;
  #idPacienteAtual;

  set idSensor(value) {
    if (typeof value !== "string" || value.trim() == "") {
      throw new Error("ID do sensor está inválido.");
    }

    this.#idSensor = value;
  }

  get idSensor() {
    return this.#idSensor;
  }

  set idPacienteAtual(value) {
    if (value !== null) {
      const parsed = Number(value);
      if (!Number.isInteger(parsed))
        throw new Error("ID do Paciente deve ser um valor inteiro.");
    }

    this.#idPacienteAtual = value;
  }

  get idPacienteAtual() {
    return this.#idPacienteAtual;
  }
};
