const LeituraDAO = require("../dao/LeituraDAO");
const Leitura = require("../model/Leitura");

module.exports = class LeituraService {
  #leituraDAO;

  constructor(leituraDAODependency) {
    console.log("LeituraService.constructor()");
    this.#leituraDAO = leituraDAODependency;
  }

  createLeitura = async (leituraJson) => {
    console.log("LeituraService.createLeitura()");

    const leitura = new Leitura();

    leitura.idPaciente = leituraJson.idPaciente;
    leitura.temperatura = leituraJson.temperatura;
    leitura.umidade = leituraJson.umidade;

    if (leitura.temperatura < 33.0) {
      console.warn(
        `ALERTA: Possível hipotermia no paciente ${leitura.idPaciente}! (Temp: ${leitura.temperatura}°C)`,
      );
    }

    return this.#leituraDAO.create(leitura);
  };

  findRecentByPaciente = async (idPaciente) => {
    console.log("LeituraService.findRecentByPaciente()");

    const leituraValidacao = new Leitura();
    leituraValidacao.idPaciente = idPaciente;

    return this.#leituraDAO.findRecentByPaciente(leituraValidacao.idPaciente);
  };
};
