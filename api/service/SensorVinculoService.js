const SensorVinculoDAO = require("../dao/SensorVinculoDAO");
const SensorVinculo = require("../model/SensorVinculo");

module.exports = class SensorVinculoService {
  #sensorVinculoDAO;

  constructor(sensorVinculoDAODependency) {
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
    vinculo.idSensor = idSensor; // Valida domínio

    return this.#sensorVinculoDAO.findPacienteAtual(vinculo.idSensor);
  };
};
