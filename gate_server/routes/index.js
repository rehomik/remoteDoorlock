var express = require('express');
var router = express.Router();

var restful_api = require('../routes/restfulApi');
var debug = require('debug')('gate_server');

router.get('/', function(req, res) {

//  restful_api.sendSignalToDoor(function onComplete() {
//
//    debug("Request complete.");
//
//    res.render('index', { title: 'Express' });
//
//  });

  res.render('index', { title: 'Express' });

});

module.exports = router;