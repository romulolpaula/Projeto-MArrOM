const MeuTokenJWT = require("../http/MeuTokenJWT");

module.exports = class AutenticacaoControl {
  #usuarioService;

  constructor(usuarioServiceDependency) {
    console.log("AuthControl.constructor()");
    this.#usuarioService = usuarioServiceDependency;
  }

  login = async (request, response) => {
    console.log("AuthControl.login()");
    try {
      const { email, senha } = request.body.funcionario;

      const usuario = await this.#usuarioService.autenticar(email, senha);

      if (!usuario) {
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
};
