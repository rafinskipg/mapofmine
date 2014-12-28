var express = require('express'),
  v1 = express.Router(),
  mongoose = require('mongoose'),
  UserModel = mongoose.model('User'),
  logger;


module.exports = function (app) {
  app.use('/api/v1/user', v1);
};

//New User
v1.post('/requestaccess', mantainDataSecurity, function(req, res){
  var newUser = new UserModel(req.body);

  newUser.save(function (err, user) {
    if (err) {
      return res.send(500, err); 
    }
    res.send(200);
  });
});


/**
  You shall not change!!
**/
function mantainDataSecurity(req, res, next){
  req.body.role = 'user';
  req.body.status = 'inactive';
  return next();
}