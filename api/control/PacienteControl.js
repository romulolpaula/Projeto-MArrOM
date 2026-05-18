const PacienteService = require("../service/PacienteService");

module.exports = class PacienteControl {
  #pacienteService;

  constructor(pacienteServiceDependency) {
    console.log("PacienteControl.constructor()");
    this.#pacienteService = pacienteServiceDependency;
  }

  store = async (request, response, next) => {
    console.log("PacienteControl.store()");
    try {
      const pacienteBodyRequest = request.body.paciente;

      const novoId =
        await this.#pacienteService.createPaciente(pacienteBodyRequest);

      const objResposta = {
        success: true,
        message: "Cadastro realizado com sucesso",
        data: {
          pacientes: [
            {
              id: novoId,
              nome: pacienteBodyRequest.nome,
            },
          ],
        },
      };
      if (novoId) {
        response.status(201).send(objResposta);
      } else {
        throw new Error("Falha ao cadastrar novo Paciente");
      }
    } catch (error) {
      next(error);
    }
  };

  index = async (request, response, next) => {
    console.log("PacienteControl.index()");
    try {
      const arrayPacientes = await this.#pacienteService.findAll();

      response.status(200).send({
        success: true,
        message: "Busca realizada com sucesso",
        data: {
          pacientes: arrayPacientes,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  show = async (request, response, next) => {
    console.log("PacienteControl.show()");
    try {
      const pacienteId = parseInt(request.params.id, 10);

      const paciente = await this.#pacienteService.findById(pacienteId);

      const objResposta = {
        success: true,
        message: "Executado com sucesso",
        data: {
          pacientes: paciente,
        },
      };

      response.status(200).send(objResposta);
    } catch (error) {
      next(error);
    }
  };
};
