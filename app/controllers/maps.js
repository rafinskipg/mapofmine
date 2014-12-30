var express = require('express'),
  v1 = express.Router(),
  mongoose = require('mongoose'),
  UserModel = mongoose.model('User'),
  q = require('q'),
  logger;


module.exports = function (app) {
  app.use('/api/v1/maps', v1);
};

//Recent maps
v1.get('/recent', function(req, res){
  getRecentMaps()
    .then(function(maps){
      res.send(maps);
    })
    .catch(function(err){
      res.send(500);
    });
});


function getRecentMaps(){
  var dfd = q.defer();

  UserModel.find({})
    .limit(6)
    .exec(function(err, data){
      if(err) {
        dfd.reject(err); 
      }else{
        dfd.resolve(data);
      }
    });

  return dfd.promise;
}