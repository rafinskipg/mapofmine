var ig = require('instagram-node').instagram();
var express = require('express'),
  router = express.Router(),
  igconfig = require('../igconfig'),
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
      res.send("Didn't work");
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
  ig.user_media_recent(req.params.id, {count: -1}, function(err, medias, pagination, remaining, limit) {
    if(err){
      console.log('Error', err);
      res.send('Error' +err);
    }else{
      res.send(medias);  
    }
    
  });
}

