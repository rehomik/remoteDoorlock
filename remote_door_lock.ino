// //
// // remote door lock
// // 
// // create by rehomik
// //

// const int _buttonPin = 2;
// const int _ledPin =  4;
// const int _gatePin = 7;

// int _buttonState = 0;

// int _powerOnTime = 1000;

// void setup()
// {
//   pinMode(_ledPin, OUTPUT);
//   pinMode(_gatePin, OUTPUT);

//   pinMode(_buttonPin, INPUT);
// }

// void loop()
// {
//   _buttonState = digitalRead(_buttonPin);
  
//   boolean power_turn_on = false;
  
//   if (_buttonState == HIGH)
//   {
//     digitalWrite(_ledPin, HIGH);
//     digitalWrite(_gatePin, HIGH);

//     delay(_powerOnTime);

//     digitalWrite(_ledPin, LOW);
//     digitalWrite(_gatePin, LOW);
//   }
// }

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

	Serial.println(WiFi.localIP());

	digitalWrite(_redRedPin, LOW);
	digitalWrite(_GreenLedPin, HIGH);

	// server setup
	_server.begin();
}

void loop()
{
	if (!_runPermission) return;

	boolean is_reconnected = false;

	// Check WiFi status
	while (_wifiStatus != WL_CONNECTED)
	{
		initLED();

		_wifiStatus = WiFi.begin(LOCAL_SSID, LOCAL_PW);	

		delay(WIFI_CONNECTION_WAIT_TIME);

		is_reconnected = true;
	}

	if (is_reconnected)
	{
		Serial.println(WiFi.localIP());

		digitalWrite(_redRedPin, LOW);
		digitalWrite(_GreenLedPin, HIGH);
	}

	// Receive data from client
	WiFiClient client = _server.available();

	if (client)
	{
		boolean current_line_is_blank = false;

		while (client.connected())
		{
			if (client.available())
			{
				char recv_byte = client.read();
				Serial.write(recv_byte);

				if ( (recv_byte == '\n') && (current_line_is_blank) )
				{
					client.println(SERVER_RESPONSE_200_OK);
					client.println(SERVER_RESPONSE_CONTENT_TYPE_TEXT);
					client.println(SERVER_RESPONSE_CONNECTION_CLOSE);
					client.println();

					sendSignalToDoor();

					break;
				}
				else if (recv_byte == '\n')
				{
					current_line_is_blank = true;
				}
				else if (recv_byte != '\r')
				{
					current_line_is_blank = false;
				}
			}
		}

		delay(1);

		client.stop();

		Serial.println("client disconnected");
	}
}