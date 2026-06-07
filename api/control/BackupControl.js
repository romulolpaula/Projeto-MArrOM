const IController = require("../interfaces/IController");
const PacienteDAO = require("../dao/PacienteDAO");
const TipoFeridaDAO = require("../dao/TipoFeridaDAO");

module.exports = class BackupControl extends IController {
  #database;
  #pacienteDAO;
  #tipoFeridaDAO;

  constructor(databaseInstance) {
    super();
    this.#database = databaseInstance;
    this.#pacienteDAO = new PacienteDAO(databaseInstance);
    this.#tipoFeridaDAO = new TipoFeridaDAO(databaseInstance);
  }

  exportarJSON = async (request, response, next) => {
    try {
      console.log("BackupControl.exportarJSON()");

      const pacientes = await this.#pacienteDAO.findAll();
      const feridas = await this.#tipoFeridaDAO.findAll();

      const dadosBackup = {
        exportado_em: new Date().toISOString(),
        pacientes: pacientes,
        tipos_feridas: feridas,
      };

      response.setHeader(
        "Content-Disposition",
        "attachment; filename=backup_sistema.json",
      );
      response.setHeader("Content-Type", "application/json");

      return response.status(200).send(JSON.stringify(dadosBackup, null, 2));
    } catch (error) {
      next(error);
    }
  };

  importarJSON = async (request, response, next) => {
    try {
      console.log("BackupControl.importarJSON()");

      const { pacientes, tipos_feridas } = request.body;

      if (!pacientes && !tipos_feridas) {
        return response
          .status(400)
          .json({ success: false, message: "JSON inválido ou vazio." });
      }

      let inseridosPacientes = 0;
      let inseridosFeridas = 0;

      if (pacientes && Array.isArray(pacientes)) {
        for (const p of pacientes) {
          await this.#pacienteDAO.create({ nome: p.nome });
          inseridosPacientes++;
        }
      }

      if (tipos_feridas && Array.isArray(tipos_feridas)) {
        for (const f of tipos_feridas) {
          await this.#tipoFeridaDAO.create({
            nome: f.nome,
            descricao: f.descricao,
          });
          inseridosFeridas++;
        }
      }

      return response.status(201).json({
        success: true,
        message: "Importação em lote realizada com sucesso!",
        detalhes: {
          pacientes_inseridos: inseridosPacientes,
          feridas_inseridas: inseridosFeridas,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  index = async (req, res) => {
    res.status(501).send();
  };
  store = async (req, res, next) => {
    return await this.importarJSON(req, res, next);
  };
  show = async (req, res, next) => {
    return await this.exportarJSON(req, res, next);
  };
  update = async (req, res) => {
    res.status(501).send();
  };
  destroy = async (req, res) => {
    res.status(501).send();
  };
};
