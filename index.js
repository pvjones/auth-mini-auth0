var express = require('express');
var session = require('express-session');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var app = express();
var config = require('./config')

app.use(session({
  secret: config.secret
}));
app.use(passport.initialize());
app.use(passport.session());

//now set up passport.use
//make auth config so it's harder for mallers to access this info
passport.use(new Auth0Strategy(config.authConfig, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

//AUTH ENDPOINTS
app.get('/auth', passport.authenticate('auth0')); //this will initiate auth0 for user

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: '/auth/me',
  failureRedirect: '/auth/me'
})); // this endpoint defines what will happen after authentication

//Create the deserialize/serializer methods on passport.
//Since you won't be doing anything further than just passing objects to/from passport and the session, we just need bare bones methods here:
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//ME ENDPOINT
//this route returns the user's auth profile data. The data is stored in `req.user` if you've set everything up correctly. Return a JSON representation of this data at the `/me` endpoint.
//Use the browser to verify that you can in fact get the JSON data from the `/me` endpoint.
app.get('/auth/me', function(req, res, next) {
  if (!req.user) {
    return res.status(404).send('User not found');
  } else {
    return res.status(200).send(req.user);
  }
})


var port = config.port;
app.listen(port, function() {
  console.log(`express is listening on port ${port}`)
})

// With the basic auth/me setup, we get this in our browser after successful login: {"provider":"auth0","displayName":"bob@bobsmail.com","id":"auth0|589cc086a9b2407a1dcb9174","name":{},"emails":[{"value":"bob@bobsmail.com"}],"picture":"https://s.gravatar.com/avatar/5d3f8811f146d646dd4a0e8a8c093061?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fbo.png","nickname":"bob","identities":[{"user_id":"589cc086a9b2407a1dcb9174","provider":"auth0","connection":"Username-Password-Authentication","isSocial":false}],"_json":{"email_verified":false,"email":"bob@bobsmail.com","clientID":"O0Moz6blR35XR5zE6E5ZWdTWE147RLKE","updated_at":"2017-02-09T19:18:31.036Z","name":"bob@bobsmail.com","picture":"https://s.gravatar.com/avatar/5d3f8811f146d646dd4a0e8a8c093061?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fbo.png","user_id":"auth0|589cc086a9b2407a1dcb9174","nickname":"bob","identities":[{"user_id":"589cc086a9b2407a1dcb9174","provider":"auth0","connection":"Username-Password-Authentication","isSocial":false}],"created_at":"2017-02-09T19:18:30.771Z","sub":"auth0|589cc086a9b2407a1dcb9174"},"_raw":"{\"email_verified\":false,\"email\":\"bob@bobsmail.com\",\"clientID\":\"O0Moz6blR35XR5zE6E5ZWdTWE147RLKE\",\"updated_at\":\"2017-02-09T19:18:31.036Z\",\"name\":\"bob@bobsmail.com\",\"picture\":\"https://s.gravatar.com/avatar/5d3f8811f146d646dd4a0e8a8c093061?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fbo.png\",\"user_id\":\"auth0|589cc086a9b2407a1dcb9174\",\"nickname\":\"bob\",\"identities\":[{\"user_id\":\"589cc086a9b2407a1dcb9174\",\"provider\":\"auth0\",\"connection\":\"Username-Password-Authentication\",\"isSocial\":false}],\"created_at\":\"2017-02-09T19:18:30.771Z\",\"sub\":\"auth0|589cc086a9b2407a1dcb9174\"}"}