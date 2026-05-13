#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

// --- 1. CONFIGURAÇÕES DA REDE WI-FI ---
const char* ssid = "UnivapWifi";      
const char* password = "universidade";  

// --- 2. CONFIGURAÇÕES DO SERVIDOR MQTT ---
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
// Crie tópicos únicos para o seu projeto:
const char* topic_temp = "projeto_scanner_MarRom/temperatura"; 
const char* topic_umid = "projeto_scanner_MarRom/umidade";     

// --- 3. OBJETOS ---
WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Função para conectar no Wi-Fi
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

// Função para conectar no servidor MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conectar ao Broker HiveMQ...");
    // Cria um ID aleatório para não dar conflito
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
  
  // Inicia os sensores
  dht.begin();
  Wire.begin(21, 22);
  if (!mlx.begin()) {
    Serial.println("Erro: MLX90614 não encontrado!");
    while (1);
  }

  // Conecta Wi-Fi e configura MQTT
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  // Mantém a conexão MQTT viva
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Envia os dados a cada 2 segundos
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;

    float umidade = dht.readHumidity();
    float tempAlvo = mlx.readObjectTempC();

    if (isnan(umidade) || isnan(tempAlvo)) {
      Serial.println("Falha ao ler os sensores!");
      return;
    }

    // Publica os dados na nuvem (o servidor só aceita formato de texto, por isso o String)
    client.publish(topic_temp, String(tempAlvo).c_str());
    client.publish(topic_umid, String(umidade).c_str());

    Serial.print("Enviado p/ Nuvem -> Temp: ");
    Serial.print(tempAlvo);
    Serial.print(" C  |  Umidade: ");
    Serial.print(umidade);
    Serial.println(" %");
  }
}