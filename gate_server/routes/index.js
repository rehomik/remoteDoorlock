var express = require('express');
var router = express.Router();

var restful_api = require('../routes/restfulApi');
var debug = require('debug')('gate_server');

router.get('/', function(req, res) {

  res.render('index', { title: 'IMRLAB 도어락 - 동방' });

});

router.post('/', function (req, res) {

  var typed_key_array = req.body.keys;

  restful_api.comparePassword(typed_key_array, function (result) {

    if (result) {

      restful_api.sendSignalToDoor(function onComplete() {

        debug("Request complete.");

        res.json({
          result: 'success'
        });
      });

      return;
    }

    res.json({
      result: 'fail',
      msg: 'invalid password'
    });
  });
});

module.exports = router;