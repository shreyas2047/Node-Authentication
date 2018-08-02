// Load all the things we need.
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load up the user model.
var User = require('../app/models/user');

// Load the auth variables
var configAuth = require('../config/auth');

module.exports = (passport) => {
    //passport session setup
    //required for persistent login sessions
    //used to serialize the user for the session.
    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });


    // Used to deserialize the user
    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user)=> {
            done(err, user);
        });
    });

    // LOCAL SIGNUP
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done)=> {

        //Asynchronous
        //This function wont fire unless data is sent back.
        process.nextTick(()=> {
            User.findOne({'local.email': email}, (err, user)=> {
                if(err) {
                    return done(err);
                }
                if(user) {
                    return done(null, false, req.flash('signupMessage', 'The email is already taken'));
                }
                //If there is no user with that email save the user in the database.
                var newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save((err)=> {
                    if(err)
                    throw(err)
                    return done(null, newUser);
                });
            });
        });
    }));

    // LOGIN SETUP
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done)=> {
        process.nextTick(()=> {
            User.findOne({'local.email': email}, (err, user)=> {
                if(err)
                    return done(err);
                if(!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found'));
                }
                if(!user.validPassword(password, user.local.password)) {
                    return done(null, false, req.flash('loginMessage', 'Invalid Password'));
                }
                else {
                return done(null, user);
                }
            });
        });
    }));


    // FACEBOOK
    passport.use('facebook', new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    }, (token, refreshToken, profile, done)=> {
        console.log(profile);
        console.log(token);
        process.nextTick(()=> {
            User.findOne({'facebook.id': profile.id}, (err,user)=> {
                if(err)
                    return done(err);
                if(user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.faceboook.name = profile.name.givenName + '' + profile.name.familyName ;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save( (err)=> {
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    //GOOGLE
    passport.use('google', new GoogleStrategy({
        clientID : configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    }, (token, refreshToken, profile, done)=> {
        process.nextTick( ()=> {
            User.findOne({'google.id': profile.id}, (err, user)=> {
                if(err) throw err;
                if(user){
                    return done(null, user);
                }
                else {
                    let newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save((err)=> {
                        if(err)
                        throw err;
                        return done(null, newUser);
                    })
                }
            });
        });
    }));

};