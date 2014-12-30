var express = require('express'),
  router = express.Router(),
  igconfig = require('../igconfig'),
  UserModel = require('../models/user');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  UserModel.find({ instagram : {'$ne': null }})
  .limit(6)
  .select('instagram')
  .exec(function(err, data){
    if(err) {
      res.redirect('/404');
    }else{
      console.log(data)
      res.render('index', {
        title: 'Map of mine',
        clientId : igconfig.id,
        redirect: igconfig.redirect,
        usermaps: data
      });
    }
  });
});

router.get('/404', function (req, res, next) {
    res.render('oops', {
      title: 'oopsy'
    });
});
