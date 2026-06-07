const IController = require("../interfaces/IController.js");

class PacienteFeridaControl extends IController {
  #pacienteFeridaService;

  constructor(pacienteFeridaService) {
    super();
    this.#pacienteFeridaService = pacienteFeridaService;
  }

  index = async (request, response, next) => {
    try {
      const registros = await this.#pacienteFeridaService.findAll();
      response.status(200).json({ success: true, data: registros });
    } catch (error) {
      next(error);
    }
  };

  store = async (request, response, next) => {
    try {
      const { idPaciente, idTipoFerida } = request.body;

      let fotoEvolucao = null;
      if (request.file) {
        fotoEvolucao = `uploads/${request.file.filename}`;
      }

      await this.#pacienteFeridaService.create({
        idPaciente: parseInt(idPaciente),
        idTipoFerida: parseInt(idTipoFerida),
        fotoEvolucao: fotoEvolucao,
      });

      response.status(201).json({
        success: true,
        message: "Ferida vinculada ao paciente com foto salva com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  };

  show = async (request, response, next) => {
    try {
      const { id } = request.params;
      const feridasDoPaciente = await this.#pacienteFeridaService.findById(id);
      response.status(200).json({ success: true, data: feridasDoPaciente });
    } catch (error) {
      next(error);
    }
  };

  update = async (request, response, next) => {
    try {
      if (request.file)
        request.body.fotoEvolucao = `uploads/${request.file.filename}`;
      await this.#pacienteFeridaService.update(null, request.body);
      response
        .status(200)
        .json({ success: true, message: "Foto de evolução atualizada!" });
    } catch (error) {
      next(error);
    }
  };

  destroy = async (request, response, next) => {
    try {
      const { idPaciente, idTipoFerida } = request.query;
      await this.#pacienteFeridaService.delete({ idPaciente, idTipoFerida });
      response
        .status(200)
        .json({ success: true, message: "Vínculo desfeito!" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PacienteFeridaControl;
