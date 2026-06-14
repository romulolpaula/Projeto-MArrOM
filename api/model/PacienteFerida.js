module.exports = class PacienteFerida {
  #idPaciente;
  #idTipoFerida;
  #fotoEvolucao;
  #dataRegistro;

  constructor(
    idPaciente,
    idTipoFerida,
    fotoEvolucao = null,
    dataRegistro = null,
  ) {
    this.#idPaciente = idPaciente;
    this.#idTipoFerida = idTipoFerida;
    this.#fotoEvolucao = fotoEvolucao;
    this.#dataRegistro = dataRegistro;
  }

  static fromDatabase(row) {
    if (!row) return null;
    return new PacienteFerida(
      row.id_paciente,
      row.id_tipo_ferida,
      row.foto_evolucao,
      row.data_registro,
    );
  }

  toJSON() {
    return {
      idPaciente: this.#idPaciente,
      idTipoFerida: this.#idTipoFerida,
      fotoEvolucao: this.#fotoEvolucao,
      dataRegistro: this.#dataRegistro,
    };
  }

  get idPaciente() {
    return this.#idPaciente;
  }
  set idPaciente(id) {
    this.#idPaciente = id;
  }

  get idTipoFerida() {
    return this.#idTipoFerida;
  }
  set idTipoFerida(id) {
    this.#idTipoFerida = id;
  }

  get fotoEvolucao() {
    return this.#fotoEvolucao;
  }
  set fotoEvolucao(foto) {
    this.#fotoEvolucao = foto;
  }

  get dataRegistro() {
    return this.#dataRegistro;
  }
  set dataRegistro(data) {
    this.#dataRegistro = data;
  }
};
