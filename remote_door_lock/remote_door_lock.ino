#include <SPI.h>
#include <WiFi.h>
#include "config.h"

int _wifiStatus = WL_IDLE_STATUS;

WiFiServer _server(DOOR_SERVER_PORT);

boolean _runPermission = true;

// constraint
const int WIFI_CONNECTION_WAIT_TIME = 5000;
const int TIME_OF_OPENING_DOOR = 1000;

// pin port numbers
const int _GreenLedPin = 4;
const int _redRedPin = 5;
const int _transistorPin = 8;

void initPin()
{
	pinMode(_GreenLedPin, OUTPUT);
	pinMode(_redRedPin, OUTPUT);
	pinMode(_transistorPin, OUTPUT);

	initLED();
}

void initLED()
{
	digitalWrite(_redRedPin, HIGH);
  	digitalWrite(_GreenLedPin, LOW);
  	digitalWrite(_transistorPin, LOW);
}

void sendSignalToDoor()
{
	digitalWrite(_transistorPin, HIGH);
	delay(TIME_OF_OPENING_DOOR);
	digitalWrite(_transistorPin, LOW);
}

void setup()
{
	// board setup
	initPin();

	// for debug code
	Serial.begin(9600);
	//

	String fv = WiFi.firmwareVersion();

	if (fv != "1.1.0")
	{
		Serial.println("Please upgrade the firmware");

		_runPermission = false;

		return;
	}

	// wifi setup
	while (_wifiStatus != WL_CONNECTED)
	{
		_wifiStatus = WiFi.begin(LOCAL_SSID, LOCAL_PW);

		delay(WIFI_CONNECTION_WAIT_TIME);
	}

	Serial.println(SERVER_MSG_READY);
	Serial.print(SERVER_MSG_IP);
	Serial.println(WiFi.localIP());

	digitalWrite(_redRedPin, LOW);
	digitalWrite(_GreenLedPin, HIGH);

	// server setup
	_server.begin();
}

void loop()
{
	if (!_runPermission) return;

	WiFiClient client = _server.available();

	// Receive data from client
	if (client)
	{
		Serial.println(OPEN_THE_GATE_BEGIN);

		boolean current_lien_is_blank = true;

		while (client.connected())
		{
			if (client.available())
			{
				char recv_byte = client.read();
				Serial.write(recv_byte);

				if (recv_byte == '\n' && current_lien_is_blank) {

					Serial.println(OPEN_THE_GATE_SUCCESS_MSG);
					sendSignalToDoor();

					client.println(SERVER_RESPONSE_200_OK);
					client.println(SERVER_RESPONSE_CONTENT_TYPE_TEXT);
					client.println(SERVER_RESPONSE_CONNECTION_CLOSE);
					client.println();

					break;
		        }

		        if (recv_byte == '\n')
		        {
		        	current_lien_is_blank = true;
		        }
		        else if (recv_byte != '\r') {

		          current_lien_is_blank = false;
		        }
			}
		}

		delay(1);

		client.stop();

		Serial.println("client disconnected");
	}
}
