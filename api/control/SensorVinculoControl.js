const IController = require("../interfaces/IController");
const SensorVinculoService = require("../service/SensorVinculoService");

module.exports = class SensorVinculoControl extends IController {
  #sensorVinculoService;

  constructor(sensorVinculoServiceDependency) {
    super();
    console.log("SensorVinculoControl.constructor()");
    this.#sensorVinculoService = sensorVinculoServiceDependency;
  }

  update = async (request, response, next) => {
    console.log("SensorVinculoControl.update()");
    try {
      const idSensor = request.params.idSensor;
      const idPaciente = request.body.idPaciente;

      const atualizou = await this.#sensorVinculoService.vincularPaciente(
        idSensor,
        idPaciente,
      );

      if (atualizou) {
        return response.status(200).send({
          success: true,
          message: "Sensor vinculado com sucesso",
          data: {
            vinculos: [
              {
                idSensor: idSensor,
                idPacienteAtual: idPaciente,
              },
            ],
          },
        });
      } else {
        return response.status(404).send({
          success: false,
          message: "Sensor não encontrado para atualização",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  show = async (request, response, next) => {
    console.log("SensorVinculoControl.show()");
    try {
      const idSensor = request.params.idSensor;
      const idPacienteAtual =
        await this.#sensorVinculoService.obterPacienteAtual(idSensor);

      response.status(200).send({
        success: true,
        message: "Consulta realizada com sucesso",
        data: {
          idSensor: idSensor,
          idPacienteAtual: idPacienteAtual,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  index = async (request, response, next) => {
    response.status(501).send();
  };
  store = async (request, response, next) => {
    response.status(501).send();
  };
  destroy = async (request, response, next) => {
    response.status(501).send();
  };
};
