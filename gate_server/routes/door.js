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

    console.log("Send signal to door server");

    var opt = {
      host: "220.69.74.136",
      port: "40080",
      method: "GET",
      headers: {
        "Content-Type": "Content-Type: text/html",
        "User-Agent": "IMRLAB Door lock Gate Server",
        "Connection": "close",
        "Content-Length": 0
      }
    };

    var http_req = http.request(opt, function (err, res, body) {

      console.log("Response complete from door lock");

      if ( (!err) && (200 == res.statusCode) ) {

        onCompleteCallback(true);

        return;
      }

      onCompleteCallback(false);

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