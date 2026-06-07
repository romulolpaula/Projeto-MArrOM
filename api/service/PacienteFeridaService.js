const IService = require("../interfaces/IService.js");
const PacienteFerida = require("../model/PacienteFerida.js");

class PacienteFeridaService extends IService {
  #pacienteFeridaDAO;

  constructor(pacienteFeridaDAO) {
    super();
    this.#pacienteFeridaDAO = pacienteFeridaDAO;
  }

  async create(dados) {
    if (!dados.idPaciente || !dados.idTipoFerida) {
      throw new Error(
        "ID do Paciente e ID do Tipo de Ferida são obrigatórios.",
      );
    }

    // ✅ verifica duplicata antes de tentar inserir
    const jaExiste = await this.#pacienteFeridaDAO.findById(dados.idPaciente);
    if (jaExiste.some((f) => f.id === dados.idTipoFerida)) {
      throw new Error("Esta ferida já está vinculada a este paciente.");
    }

    const novoVinculo = new PacienteFerida(
      dados.idPaciente,
      dados.idTipoFerida,
      dados.fotoEvolucao || null,
    );

    return await this.#pacienteFeridaDAO.create({
      id_paciente: novoVinculo.idPaciente,
      id_tipo_ferida: novoVinculo.idTipoFerida,
      foto_evolucao: novoVinculo.fotoEvolucao,
    });
  }

  async findById(idPaciente) {
    if (!idPaciente)
      throw new Error("O ID do paciente é obrigatório para busca.");
    return await this.#pacienteFeridaDAO.findById(idPaciente);
  }

  async findAll() {
    return await this.#pacienteFeridaDAO.findAll();
  }

  async update(id, dados) {
    const model = {
      id_paciente: dados.idPaciente,
      id_tipo_ferida: dados.idTipoFerida,
      foto_evolucao: dados.fotoEvolucao,
    };
    return await this.#pacienteFeridaDAO.update(model);
  }

  async delete(dados) {
    return await this.#pacienteFeridaDAO.delete({
      id_paciente: dados.idPaciente,
      id_tipo_ferida: dados.idTipoFerida,
    });
  }
}

module.exports = PacienteFeridaService;
