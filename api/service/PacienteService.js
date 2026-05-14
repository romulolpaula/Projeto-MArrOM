const PacienteDAO = require("../dao/PacienteDAO");
const Paciente = require("../model/Paciente");

module.exports = class PacienteService {
  #pacienteDAO;

  constructor(pacienteDAODependency) {
    console.log("⬆PacienteService.constructor()");
    this.#pacienteDAO = pacienteDAODependency;
  }

  createPaciente = async (pacienteJson) => {
    console.log("PacienteService.createPaciente()");
    const paciente = new Paciente();
    paciente.nome = pacienteJson.nome;
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
};
