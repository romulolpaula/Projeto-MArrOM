const Server = require("./Server");

(async () => {
  try {
    const server = new Server(8080);

    await server.init();

    server.run();

    console.log("Servidor iniciado com sucesso");
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
})();
