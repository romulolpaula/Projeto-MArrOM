#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

// --- 1. CONFIGURAÇÕES DA REDE WI-FI ---
const char* ssid = "FAMILIA_2G";      // 👈 COLOQUE O SEU WI-FI AQUI
const char* password = "F@milialopesdepaula";    // 👈 COLOQUE A SUA SENHA AQUI

// --- 2. CONFIGURAÇÕES DO SERVIDOR MQTT ---
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

// Tópico Único unificado com o seu monitor_mqtt.js
const char* seu_topic_unificado = "romulo8una/hospital/sensor1"; 

// ID do Sensor para o Banco de Dados identificar o Vínculo
const char* ID_SENSOR = "ESP32-UNIT-01";

// --- 3. OBJETOS ---
WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando na rede: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado! IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conectar ao Broker HiveMQ...");
    String clientId = "ScannerClient-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println(" Conectado à Nuvem!");
    } else {
      Serial.print(" Falhou, erro rc=");
      Serial.print(client.state());
      Serial.println(". Tentando de novo em 5s...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  dht.begin();
  Wire.begin(21, 22);
  if (!mlx.begin()) {
    Serial.println("Erro: MLX90614 não encontrado!");
    while (1);
  }

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Envia os dados a cada 5 segundos
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    float umidade = dht.readHumidity();
    float tempAlvo = mlx.readObjectTempC();

    if (isnan(umidade) || isnan(tempAlvo)) {
      Serial.println("Falha ao ler os sensores!");
      return;
    }

    // MONTA O PACOTE JSON QUE A SUA API ESPERA
    // Formato: {"idSensor":"ESP32-UNIT-01","temperatura":36.5,"umidade":45.2}
    String jsonPayload = "{";
    jsonPayload += "\"idSensor\":\"" + String(ID_SENSOR) + "\",";
    jsonPayload += "\"temperatura\":" + String(tempAlvo, 1) + ",";
    jsonPayload += "\"umidade\":" + String(umidade, 1);
    jsonPayload += "}";

    // Publica o pacote JSON unificado
    client.publish(seu_topic_unificado, jsonPayload.c_str());

    Serial.print("Enviado p/ Nuvem -> ");
    Serial.println(jsonPayload);
  }
}