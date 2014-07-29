/**
 * Created by imrlab on 2014. 7. 29..
 * written by rehomik
 */

var debug = require('debug')('gate_server');
var http = require('http');

exports.sendSignalToDoor = function (resultCallback) {

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

    resultCallback();
  });

  http_req.end();
};