var ig = require('instagram-node').instagram();
var express = require('express'),
  router = express.Router(),
  igconfig = require('../igconfig'),
  //pictureModel = require('../models/picture'),
  q = require('q');

module.exports = function (app) {
  app.use('/', router);
};

// This is where you would initially send users to authorize
router.get('/authorize_user', authorize_user);
// This is your redirect URI
router.get('/handleauth', handleauth);
// This is your redirect URI
router.get('/pictures/:id', getPictures);

// Every call to `ig.use()` overrides the `client_id/client_secret`
// or `access_token` previously entered if they exist.
//ig.use({ access_token: 'YOUR_ACCESS_TOKEN' });
ig.use({ client_id: igconfig.id,
         client_secret: igconfig.secret  });


// This is where you would initially send users to authorize
function authorize_user (req, res) {
  res.redirect(ig.get_authorization_url(igconfig.redirect, { scope: ['likes'], state: 'a state' }));
}

// This is your redirect URI
function handleauth(req, res) {
  ig.authorize_user(req.query.code, igconfig.redirect, function(err, result) {
    if (err) {
      console.log(err.body);
      res.redirect('/');
    } else {
      console.log('Yay! Access token is ' + result.access_token +' for user' + result.user.username);
      renderMap(res,result);
    }
  });
}

function renderMap(res, info){
  res.render('map', {
    title: 'Hi,'+info.user.username+' this is your map...',
    info: info
  });
}

function getPictures(req, res){
  accPictures(req.params.id)
    .then(function(media){
      res.send(media);
    })
    .fail(function(error){
      res.send(500);
    })
}

function accPictures(userId){
  var dfd = q.defer();
  
  var doRequestMedia = function(nextId, acc){
    var options = {
      count: 100
    }
    if(nextId){
      options.max_id = nextId;
    }
    
    //Do request
    ig.user_media_recent(userId, options, function(err, medias, pagination, remaining, limit) {
      if(err){
        console.log('ERROR' , err);
        dfd.reject(err);
      }else{
        acc = acc.concat(medias);
        if(!pagination.next_max_id){ 
          console.log('resolving')
          dfd.resolve(acc); 
        } else {
          console.log('requesting', pagination.next_max_id);
          return doRequestMedia(pagination.next_max_id, acc);
        }
      }
    });
  }
  
  doRequestMedia(null, []);
  
  return dfd.promise;
}

