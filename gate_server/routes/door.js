/**
 * Created by imrlab on 2014. 7. 31..
 *
 * Written by rehomik
 */

var debug = require('debug')('gate_server');
var http = require('http');
var mongojs = require('mongojs');
var db = mongojs('/doorlock_d', ['pw']);

exports.locker = {

  request: function (onCompleteCallback) {

    debug("Send signal to door server");

    var opt = {
      host: "220.69.74.136",
      port: "40080",
      method: "GET",
      headers: {
        "Content-Type": "Content-Type: text/html",
        "User-Agent": "Door lock Gate Server",
        "Connection": "close"
      }
    };

		// Send request to gate server.
    var http_req = http.request(opt, function (res) {

			console.log("Res status code: " + res.statusCode);
			console.log("Res header: " + res.headers);

      onCompleteCallback();
    });

		// handle error.
		http_req.on('error', function(e) {

			console.log('request error: ' + e.message);
		});

		// handle time out.
		http_req.on('socket', function (socket) {

			socket.setTimeout(3000);
			socket.on('timeout', function() {

				console.log("request aborted")

				http_req.abort();
			});
		});

		http_req.end();
  }
};

exports.auth = {

  identify: function (typed_key_string, resultCallback) {

    db.pw.find({}).sort({date:-1}).limit(1, function (err, docs) {

      var pw_data = docs[0].word;

      if (pw_data === typed_key_string) {

        resultCallback(true);

        return;
      }

      resultCallback(false);

    });
  }
};