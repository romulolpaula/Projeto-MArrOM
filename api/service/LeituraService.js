const IService = require("../interfaces/IService");
const LeituraDAO = require("../dao/LeituraDAO");
const Leitura = require("../model/Leitura");

module.exports = class LeituraService extends IService {
  #leituraDAO;

  constructor(leituraDAODependency) {
    super();
    console.log("LeituraService.constructor()");
    this.#leituraDAO = leituraDAODependency;
  }

  createLeitura = async (leituraJson) => {
    console.log("LeituraService.createLeitura()");

    const leitura = new Leitura();

    leitura.idSensor = leituraJson.idSensor;
    leitura.idPaciente = leituraJson.idPaciente;
    leitura.temperatura = leituraJson.temperatura;
    leitura.umidade = leituraJson.umidade;

    if (leitura.temperatura < 33.0) {
      console.warn(
        `Alerta: Possível hipotermia no paciente ${leitura.idPaciente}! (Temp: ${leitura.temperatura}°C)`,
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

  create = async (dados) => {
    return await this.createLeitura(dados);
  };
  findById = async (id) => {
    return await this.findRecentByPaciente(id);
  };
  findAll = async () => {
    return [];
  };
  update = async (id, dados) => {
    return true;
  };
  delete = async (id) => {
    return true;
  };
};
