const IService = require("../interfaces/IService");

module.exports = class LogService extends IService {
  #logDAO;

  constructor(logDAODependency) {
    super();
    this.#logDAO = logDAODependency;
  }

  logAutenticacao = async ({ usuario, ip, userAgent, sucesso, detalhe }) => {
    await this.#logDAO.inserir({
      acao: sucesso ? "LOGIN_SUCESSO" : "LOGIN_FALHA",
      tipo_evento: "autenticacao",
      usuario: usuario || "desconhecido",
      descricao: sucesso
        ? `Usuário autenticado com sucesso`
        : `Falha na autenticação: ${detalhe || "credenciais inválidas"}`,
      ip_origem: ip,
      user_agent: userAgent,
    });
  };

  logInclusao = async ({ usuario, ip, tabela, registroId, dados }) => {
    await this.#logDAO.inserir({
      acao: "INCLUSAO",
      tipo_evento: "cadastro",
      usuario: usuario || "sistema",
      descricao: `Novo registro inserido em '${tabela}' (ID: ${registroId})`,
      tabela,
      registro_id: registroId,
      dados_vinculados: dados,
      ip_origem: ip,
    });
  };

  logAlteracao = async ({ usuario, ip, tabela, registroId, antes, depois }) => {
    await this.#logDAO.inserir({
      acao: "ALTERACAO",
      tipo_evento: "edicao",
      usuario: usuario || "sistema",
      descricao: `Registro alterado em '${tabela}' (ID: ${registroId})`,
      tabela,
      registro_id: registroId,
      dados_antes: antes,
      dados_depois: depois,
      ip_origem: ip,
    });
  };

  logExclusao = async ({ usuario, ip, tabela, registroId, dados }) => {
    await this.#logDAO.inserir({
      acao: "EXCLUSAO",
      tipo_evento: "exclusao",
      usuario: usuario || "sistema",
      descricao: `Registro removido de '${tabela}' (ID: ${registroId})`,
      tabela,
      registro_id: registroId,
      dados_vinculados: dados,
      ip_origem: ip,
    });
  };

  logAcesso = async ({
    usuario,
    ip,
    userAgent,
    endpoint,
    metodo,
    statusCode,
    tempoResposta,
  }) => {
    await this.#logDAO.inserir({
      acao: "ACESSO_ROTA",
      tipo_evento: "acesso",
      usuario: usuario || "anonimo",
      descricao: `${metodo} ${endpoint} → ${statusCode} (${tempoResposta}ms)`,
      endpoint,
      metodo,
      status_code: statusCode,
      tempo_resposta_ms: tempoResposta,
      ip_origem: ip,
      user_agent: userAgent,
    });
  };

  logErro = async ({ usuario, ip, endpoint, metodo, erro, stackTrace }) => {
    await this.#logDAO.inserir({
      acao: "ERRO",
      tipo_evento: "erro",
      usuario: usuario || "sistema",
      descricao: `Erro em ${metodo} ${endpoint}: ${erro}`,
      endpoint,
      metodo,
      erro_mensagem: erro,
      stack_trace: stackTrace,
      ip_origem: ip,
    });
  };

  buscarLogs = async (filtros) => {
    return this.#logDAO.buscar(filtros);
  };

  gerarXML = async (filtros = {}) => {
    const logs = await this.#logDAO.buscar(filtros);

    const escapar = (str) => {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    const formatarData = (d) => {
      if (!d) return "";
      return new Date(d).toISOString().replace("T", " ").slice(0, 19);
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<logs total="${logs.length}" gerado_em="${new Date().toISOString()}">\n`;

    logs.forEach((log, index) => {
      xml += `  <evento id="${index + 1}">\n`;
      xml += `    <usuario>${escapar(log.usuario)}</usuario>\n`;
      xml += `    <acao>${escapar(log.acao)}</acao>\n`;
      xml += `    <descricao>${escapar(log.descricao)}</descricao>\n`;
      xml += `    <data_hora>${formatarData(log.timestamp)}</data_hora>\n`;
      xml += `    <tipo_evento>${escapar(log.tipo_evento)}</tipo_evento>\n`;
      xml += `    <ip_origem>${escapar(log.ip_origem)}</ip_origem>\n`;

      if (log.tabela) {
        xml += `    <dados_vinculados>\n`;
        xml += `      <tabela>${escapar(log.tabela)}</tabela>\n`;
        xml += `      <registro_id>${escapar(log.registro_id)}</registro_id>\n`;
        xml += `    </dados_vinculados>\n`;
      }

      if (log.endpoint) {
        xml += `    <requisicao>\n`;
        xml += `      <metodo>${escapar(log.metodo)}</metodo>\n`;
        xml += `      <endpoint>${escapar(log.endpoint)}</endpoint>\n`;
        if (log.status_code)
          xml += `      <status_code>${log.status_code}</status_code>\n`;
        if (log.tempo_resposta_ms)
          xml += `      <tempo_ms>${log.tempo_resposta_ms}</tempo_ms>\n`;
        xml += `    </requisicao>\n`;
      }

      if (log.erro_mensagem) {
        xml += `    <erro>\n`;
        xml += `      <mensagem>${escapar(log.erro_mensagem)}</mensagem>\n`;
        xml += `    </erro>\n`;
      }

      xml += `  </evento>\n`;
    });

    xml += `</logs>`;
    return xml;
  };

  create = async (dados) => {
    return await this.#logDAO.inserir(dados);
  };
  findAll = async () => {
    return await this.buscarLogs();
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
