#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "";    
const char* password = "";    

const char* mqtt_server = "";
const int mqtt_port = ;

const char* seu_topic_unificado = ""; 

const char* ID_SENSOR = "";

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


    String jsonPayload = "{";
    jsonPayload += "\"idSensor\":\"" + String(ID_SENSOR) + "\",";
    jsonPayload += "\"temperatura\":" + String(tempAlvo, 1) + ",";
    jsonPayload += "\"umidade\":" + String(umidade, 1);
    jsonPayload += "}";

    client.publish(seu_topic_unificado, jsonPayload.c_str());

    Serial.print("Enviado p/ Nuvem -> ");
    Serial.println(jsonPayload);
  }
}