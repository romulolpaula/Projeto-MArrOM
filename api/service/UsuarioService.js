const IService = require("../interfaces/IService");
const Usuario = require("../model/Usuario");

module.exports = class UsuarioService extends IService {
  #usuarioDAO;

  constructor(usuarioDAODependency) {
    super();
    console.log("UsuarioService.constructor()");
    this.#usuarioDAO = usuarioDAODependency;
  }

  autenticar = async (emailJson, senhaJson) => {
    console.log("UsuarioService.autenticar()");

    const validacao = new Usuario();
    validacao.email = emailJson;
    validacao.senha = senhaJson;

    const linhas = await this.#usuarioDAO.findByEmail(validacao.email);

    if (linhas.length === 0) {
      return null;
    }

    const dadosBanco = linhas[0];

    if (dadosBanco.senha !== validacao.senha) {
      return null;
    }

    const usuarioAutenticado = new Usuario();
    usuarioAutenticado.id = dadosBanco.id;
    usuarioAutenticado.nome = dadosBanco.nome;
    usuarioAutenticado.email = dadosBanco.email;

    return usuarioAutenticado;
  };

  create = async (dados) => {
    return true;
  };
  findAll = async () => {
    return [];
  };
  findById = async (id) => {
    return null;
  };
  update = async (id, dados) => {
    return true;
  };
  delete = async (id) => {
    return true;
  };
};
