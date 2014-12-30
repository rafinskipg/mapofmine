var express = require('express'),
  router = express.Router(),
  igconfig = require('../igconfig');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

    res.render('index', {
      title: 'Map of mine',
      clientId : igconfig.id,
      redirect: igconfig.redirect
    });
});

router.get('/404', function (req, res, next) {
    res.render('oops', {
      title: 'oopsy'
    });
});
