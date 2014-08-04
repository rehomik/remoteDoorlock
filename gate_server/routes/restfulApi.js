/**
 * Created by imrlab on 2014. 7. 29..
 * written by rehomik
 */

var door = require('./door');

exports.sendSignalToDoor = function (onComplateCallback) {

  door.locker.request(onComplateCallback);
};

exports.comparePassword = function (typed_key_string, resultCallback) {

  door.auth.identify(typed_key_string, resultCallback);
};