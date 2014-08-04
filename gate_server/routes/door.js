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
      host: "10.0.1.9",
      port: "49180",
      method: "GET",
      headers: {
        "Content-Type": "Content-Type: text/html",
        "User-Agent": "Door lock Gate Server 0.1",
        "Connection": "close"
      }
    };

    var http_req = http.request(opt, function (res) {

      onCompleteCallback();
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