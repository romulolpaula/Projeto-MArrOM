module.exports = class Usuario {
  #id;
  #nome;
  #email;
  #senha;

  constructor() {
    console.log("Usuario.constructor()");
  }

  set id(value) {
    this.#id = Number(value);
  }
  get id() {
    return this.#id;
  }

  set nome(value) {
    if (!value || value.trim().length < 3) {
      throw new Error(
        "O nome do profissional deve ter pelo menos 3 caracteres.",
      );
    }
    this.#nome = value;
  }
  get nome() {
    return this.#nome;
  }

  set email(value) {
    if (!value || !value.includes("@")) {
      throw new Error("E-mail inválido para o registro profissional.");
    }
    this.#email = value;
  }
  get email() {
    return this.#email;
  }

  set senha(value) {
    if (!value || value.length < 4) {
      throw new Error("A senha deve conter pelo menos 4 caracteres.");
    }
    this.#senha = value;
  }
  get senha() {
    return this.#senha;
  }
};
