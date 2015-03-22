var ig = require('instagram-node').instagram();
var express = require('express'),
  router = express.Router(),
  igconfig = require('../igconfig'),
  userModel = require('../models/user'),
  q = require('q');

module.exports = function (app) {
  app.use('/', router);
};

// This is where you would initially send users to authorize
router.get('/authorize_user', authorize_user);
// This is your redirect URI
router.get('/handleauth', handleauth);
// Get the pictures for the map
router.get('/pictures/:id/:username', getPictures);

// Get the stored pictures for the user
router.get('/:username', getUserMap);

// Every call to `ig.use()` overrides the `client_id/client_secret`
// or `access_token` previously entered if they exist.
//ig.use({ access_token: 'YOUR_ACCESS_TOKEN' });
ig.use({ client_id: igconfig.id,
         client_secret: igconfig.secret  });


// This is where you would initially send users to authorize
function authorize_user (req, res) {
  console.log('authorize')
  res.redirect(ig.get_authorization_url(igconfig.redirect, { scope: ['likes'], state: 'a state' }));
}

// This is your redirect URI. We store a user, if it doesn't exist and redirect to its map
function handleauth(req, res) {
  console.log('handling auth');
  ig.authorize_user(req.query.code, igconfig.redirect, function(err, result) {
    if (err) {
      console.log(err.body);
      res.redirect('/');
    } else {
      console.log('Yay! Access token is ' + result.access_token +' for user ' + result.user.username);
      getOrCreateUser(result.user)
        .then(function(user){
          console.log('fetching images');
          //TODO If fetch images fails, because of private, send to error and remove the user.
          return fetchImages(user);
        })
        .then(function(user){
          console.log('user found, redirecting');
          res.redirect('/'+user.instagram.username);
        })
        .catch(function(err){
          console.log(err);
          console.log('removing', result.user.username)
          userModel.remove({'instagram.username': result.user.username}, function (err) {
            console.log(err);
          });
          res.render('error', { error : err});
          
        })
    }
  });
}

function getUserMap(req, res){
  findUserInstagram(req.params.username)
    .then(function(user){
      console.log('found user', user)
      renderMap(res, user);
    })
    .catch(function(err){
      console.log(err)
      console.log('That user does not exist');
      res.redirect('/404');
    });
}

function renderMap(res, user){
  res.render('map', {
    title: 'Hi,'+user.instagram.username+' this is your map...',
    userName: user.instagram.username,
    userId: user.instagram.id
  });
}

//Get pictures for the map
function getPictures(req, res){
  findUserInstagram(req.params.username)
    .then(function(user){
      res.send(user.pictures);
      user.visits += 1;
      user.last_visit = Date.now();
      user.save(function(err){
        if(err){ 
          console.log(err);
        }else{
          console.log('User updated stadistics');
        }
        
      })
    })
    .catch(function(err){
      console.log('Error getting pictures', err);
      res.send(500);
    });
}

//Do recursive requests to the instagram API and get all of them
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


//Stores the media in the user, replacing all the user pictures
function storeMedia(user, media){
  var dfd = q.defer();
      
  user.updated_at = Date.now();
  user.last_login = Date.now();
  user.pictures = media;
      
  user.save(function(err){
    if(err) return dfd.reject(err);
    console.log('user updated');
    dfd.resolve(media);
  });
  
  return dfd.promise;
}

function findUserInstagram(username){
  var dfd = q.defer();
  
  userModel.findOne({ "instagram.username" : username }, function(err, user){
    if(err){
      console.log('Error getting user ', err);
      dfd.reject(err);
    }else{
      dfd.resolve(user);
    }
  })
  
  return dfd.promise;
}

function fetchImages(user){
  var dfd = q.defer();
  
  accPictures(user.instagram.id)
  .then(function(media){
    return storeMedia(user, media);
  })
  .then(function(media){
    dfd.resolve(user);
  })
  .catch(function(error){
    dfd.reject(error);
  });
  
  return dfd.promise;
}

function getOrCreateUser(userInstagram){
  var dfd = q.defer();
  
  findUserInstagram(userInstagram.username)
    .then(function(user){
      if(!user){
        console.log('user not found, creating one');
        user = new userModel();
        user.instagram = userInstagram;
        
        user.save(function (err, user) {
          if (err) {
            dfd.reject(err);
          }else{
            dfd.resolve(user);
          }
        });
        
      }else{
        console.log('Ey found', user);
        dfd.resolve(user);
      }
      
    })
    .catch(function(err){
      console.log(err);
    });
  
  return dfd.promise;
}