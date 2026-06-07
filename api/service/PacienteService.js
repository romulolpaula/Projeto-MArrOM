const IService = require("../interfaces/IService");
const PacienteDAO = require("../dao/PacienteDAO");
const Paciente = require("../model/Paciente");

module.exports = class PacienteService extends IService {
  #pacienteDAO;

  constructor(pacienteDAODependency) {
    super();
    console.log("⬆PacienteService.constructor()");
    this.#pacienteDAO = pacienteDAODependency;
  }

  createPaciente = async (pacienteJson) => {
    console.log("PacienteService.createPaciente()");
    const paciente = new Paciente();
    paciente.nome = pacienteJson.nome;
    paciente.status_monitoramento = pacienteJson.status_monitoramento ?? false;
    return this.#pacienteDAO.create(paciente);
  };

  findAll = async () => {
    console.log("PacienteService.findAll()");
    return this.#pacienteDAO.findAll();
  };

  findById = async (idPaciente) => {
    console.log("PacienteService.findById()");
    const paciente = new Paciente();
    paciente.id = idPaciente;
    return this.#pacienteDAO.findById(paciente.id);
  };

  create = async (dados) => {
    return await this.createPaciente(dados);
  };

  update = async (id, dados) => {
    return true;
  };

  delete = async (id) => {
    return true;
  };
};
