module.exports = class Paciente {
  #id;
  #nome;

  constructor() {
    console.log("Paciente.constructor()");
  }

  set id(value) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error("ID do Paciente deve ser um nº inteiro E positivo.");
    }

    this.#id = parsed;
  }

  get id() {
    return this.#id;
  }

  set nome(value) {
    if (typeof value !== "string") {
      throw new Error("O nome do paciente deve ser uma string (texto).");
    }

    const nomeLimpo = value.trim();
    if (nomeLimpo.length < 3) {
      throw new Error("O nome deve ter pelo menos 3 letras.");
    }

    this.#nome = nomeLimpo;
  }

  get nome() {
    return this.#nome;
  }
};
