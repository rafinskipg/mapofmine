var express = require('express'),
  router = express.Router(),
  igconfig = require('../igconfig'),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Our instagram map',
      articles: articles,
      clientId : igconfig.id,
      redirect: igconfig.redirect
    });
});
