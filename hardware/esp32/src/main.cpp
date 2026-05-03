#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <DHT.h>

// --- Configurações do Sensor de Umidade (DHT22) ---
#define DHTPIN 4      // Pino digital D4 onde o 'out' do DHT22 está ligado
#define DHTTYPE DHT22 // Define que o sensor é o DHT22

// --- Criação dos Objetos dos Sensores ---
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando o Scanner de Curativos...");
  Serial.println("-----------------------------------");

  // Inicia o sensor de Umidade DHT22
  dht.begin();

  // Força o I2C nos pinos 21 (SDA) e 22 (SCL) para o sensor de Temperatura
  Wire.begin(21, 22);

  // Inicia o sensor de Temperatura MLX90614
  if (!mlx.begin()) {
    Serial.println("ERRO: Sensor MLX90614 nao encontrado! Verifique os fios SDA e SCL.");
    while (1); // Trava aqui se der erro
  }

  Serial.println("Sucesso! Todos os sensores estao prontos.");
  Serial.println("Aguardando leituras...");
  delay(2000); // Dá um tempo para o DHT22 estabilizar
}

void loop() {
  // O DHT22 é um sensor mais lento. Ele exige pelo menos 2 segundos entre as leituras.
  delay(2000); 

  // --- Lê a Umidade do DHT22 ---
  float umidade = dht.readHumidity();

  // --- Lê a Temperatura Irradiada (Alvo) do MLX90614 ---
  float tempAlvo = mlx.readObjectTempC();

  // Checa se o DHT22 conseguiu ler a umidade corretamente (isnan = is not a number)
  if (isnan(umidade)) {
    Serial.println("Falha na leitura da umidade (DHT22)!");
  } else {
    // Imprime os dados reais no Monitor Serial
    Serial.print("Umidade da Ferida: ");
    Serial.print(umidade);
    Serial.print("%  |  ");
  }

  Serial.print("Temperatura da Ferida: ");
  Serial.print(tempAlvo);
  Serial.println(" °C");
}