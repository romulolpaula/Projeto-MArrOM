const IController = require("../interfaces/IController");
const MeuTokenJWT = require("../http/MeuTokenJWT");

module.exports = class AutenticacaoControl extends IController {
  #usuarioService;
  #logService;

  constructor(usuarioServiceDependency, logServiceDependency = null) {
    super(); // Adicionado para cumprir o contrato
    console.log("AuthControl.constructor()");
    this.#usuarioService = usuarioServiceDependency;
    this.#logService = logServiceDependency;
  }

  login = async (request, response) => {
    console.log("AuthControl.login()");
    const ip = request.ip || "desconhecido";
    const userAgent = request.headers["user-agent"] || "";

    try {
      const { email, senha } = request.body.funcionario;

      const usuario = await this.#usuarioService.autenticar(email, senha);

      if (!usuario) {
        await this.#logService?.logAutenticacao({
          usuario: email,
          ip,
          userAgent,
          sucesso: false,
          detalhe: "Credenciais incorretas",
        });

        return response.status(401).json({
          success: false,
          message: "Credenciais de acesso incorretas.",
        });
      }

      const meuJwt = new MeuTokenJWT();
      const payloadToken = {
        email: usuario.email,
        name: usuario.nome,
        role: "PROFISSIONAL_SAUDE",
        idFuncionario: usuario.id,
      };
      const tokenGerado = meuJwt.gerarToken(payloadToken);

      await this.#logService?.logAutenticacao({
        usuario: usuario.email,
        ip,
        userAgent,
        sucesso: true,
      });

      return response.status(200).json({
        success: true,
        message: "Login efetuado com sucesso!",
        token: tokenGerado,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (erro) {
      console.error("Erro no AuthControl:", erro);
      return response.status(500).json({
        success: false,
        message: "Erro interno ao processar autenticação.",
      });
    }
  };

  store = async (request, response, next) => {
    return await this.login(request, response);
  };
  index = async (request, response, next) => {
    response.status(501).send();
  };
  show = async (request, response, next) => {
    response.status(501).send();
  };
  update = async (request, response, next) => {
    response.status(501).send();
  };
  destroy = async (request, response, next) => {
    response.status(501).send();
  };
};
