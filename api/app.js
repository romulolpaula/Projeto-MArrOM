const Server = require("./Server");

/**
 * Arquivo principal de inicialização do servidor (IIFE Assíncrona).
 */
(async () => {
  try {
    // Cria a instância do servidor na porta 8080 conforme padrão do professor
    const server = new Server(8080);

    // Inicializa o servidor (estabelece conexões com banco, injeta camadas, cria rotas)
    await server.init();

    // Inicia o servidor Express para escutar requisições
    server.run();

    console.log("✅ Servidor iniciado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
})();
