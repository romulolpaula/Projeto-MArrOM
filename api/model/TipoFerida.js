module.exports = class TipoFerida {
  #id;
  #nome;
  #descricao;

  constructor(id = null, nome = "", descricao = "") {
    this.#id = id;
    this.#nome = nome;
    this.#descricao = descricao;
  }

  get id() {
    return this.#id;
  }
  set id(value) {
    this.#id = value;
  }

  get nome() {
    return this.#nome;
  }
  set nome(value) {
    this.#nome = value;
  }

  get descricao() {
    return this.#descricao;
  }
  set descricao(value) {
    this.#descricao = value;
  }
};
