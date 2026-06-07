const IService = require("../interfaces/IService");
const SensorVinculoDAO = require("../dao/SensorVinculoDAO");
const SensorVinculo = require("../model/SensorVinculo");

module.exports = class SensorVinculoService extends IService {
  #sensorVinculoDAO;

  constructor(sensorVinculoDAODependency) {
    super();
    console.log("SensorVinculoService.constructor()");
    this.#sensorVinculoDAO = sensorVinculoDAODependency;
  }

  vincularPaciente = async (idSensor, idPaciente) => {
    console.log("SensorVinculoService.vincularPaciente()");

    const vinculo = new SensorVinculo();

    vinculo.idSensor = idSensor;
    vinculo.idPacienteAtual = idPaciente;

    return this.#sensorVinculoDAO.updateVinculo(vinculo);
  };

  obterPacienteAtual = async (idSensor) => {
    console.log("SensorVinculoService.obterPacienteAtual()");

    const vinculo = new SensorVinculo();
    vinculo.idSensor = idSensor;

    return this.#sensorVinculoDAO.findPacienteAtual(vinculo.idSensor);
  };

  create = async (dados) => {
    return true;
  };
  findAll = async () => {
    return [];
  };
  findById = async (id) => {
    return await this.obterPacienteAtual(id);
  };
  update = async (id, dados) => {
    return await this.vincularPaciente(id, dados.idPaciente);
  };
  delete = async (id) => {
    return true;
  };
};
