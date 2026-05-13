module.exports = class Leitura {
  #idPaciente;
  #temperatura;
  #umidade;
  #dataHora;

  constructor() {
    console.log("Leitura.constructor()");
  }

  set idPaciente(value) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      throw new Error("idPaciente deve ser um número inteiro.");
    }
    if (parsed <= 0) {
      throw new Error("idPaciente deve ser maior que zero.");
    }
    this.#idPaciente = parsed;
  }

  get idPaciente() {
    return this.#idPaciente;
  }

  set temperatura(value) {
    const temp = parseFloat(value);
    if (isNaN(temp)) {
      throw new Error("A temperatura deve ser um número válido.");
    }
    if (temp < 20 || temp > 50) {
      throw new Error(
        "Temperatura fora da faixa de monitoramento clínico (20°C - 50°C).",
      );
    }
    this.#temperatura = temp;
  }

  get temperatura() {
    return this.#temperatura;
  }

  set umidade(value) {
    const umid = parseFloat(value);
    if (isNaN(umid) || umid < 0 || umid > 100) {
      throw new Error("A umidade deve ser um percentual entre 0 e 100.");
    }
    this.#umidade = umid;
  }

  get umidade() {
    return this.#umidade;
  }
};
