console.log("Iniciando cliente MQTT com Vínculo Dinâmico...");

const mqtt = require("mqtt");
const mysql = require("mysql2/promise");

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const SEU_TOPICO = "romulo8una/hospital/sensor1";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "marrom_sistemadeacompanhamento",
  port: 3306,
};

console.log("Tentando conectar ao broker público...");

client.on("connect", function () {
  console.log("Conectado ao broker MQTT (HiveMQ) com sucesso!");
  client.subscribe(SEU_TOPICO, function (erro) {
    if (!erro) {
      console.log(`Inscrito com sucesso no tópico: "${SEU_TOPICO}"`);
    }
  });
});

client.on("message", async function (topico, mensagem) {
  console.log("\nMensagem MQTT recebida no broker");

  let conexao;
  try {
    const textoMensagem = mensagem.toString();
    const dados = JSON.parse(textoMensagem);

    const idSensor = dados.idSensor || "ESP32-UNIT-01";
    const temperatura = dados.temperatura;
    const umidade = dados.umidade || 0.0;

    console.log(
      `Hardware -> Sensor: ${idSensor} | Temp: ${temperatura}°C | Umid: ${umidade}%`,
    );

    conexao = await mysql.createConnection(dbConfig);

    const [linhas] = await conexao.execute(
      "SELECT id_paciente_atual FROM sensores_vinculo WHERE id_sensor = ? LIMIT 1",
      [idSensor],
    );

    let idPaciente = null;

    if (linhas.length > 0 && linhas[0].id_paciente_atual) {
      idPaciente = linhas[0].id_paciente_atual;
      console.log(
        `📌 [BANCO] Vínculo ativo encontrado: Paciente ID ${idPaciente}`,
      );
    } else {
      idPaciente = 1;
      console.log(
        `Nenhum vínculo no banco para ${idSensor}. Usando padrão: Paciente ID 1`,
      );
    }

    console.log(
      `📤 Enviando POST para salvar a leitura clínica do Paciente ${idPaciente}...`,
    );

    const resposta = await fetch("http://localhost:8080/api/v1/leituras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leitura: {
          idSensor: idSensor,
          id_sensor: idSensor,
          idPaciente: parseInt(idPaciente, 10),
          id_paciente: parseInt(idPaciente, 10),
          temperatura: temperatura,
          umidade: umidade,
        },
      }),
    });

    console.log("Status HTTP da Resposta:", resposta.status);
  } catch (erro) {
    console.log("Erro ao processar a mensagem MQTT:", erro.message);
  } finally {
    if (conexao) {
      await conexao.end();
    }
  }
});
