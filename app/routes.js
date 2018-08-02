module.exports = (app, passport) => {

//HOME PAGE
app.get('/', (req, res) => {
    res.render('index.ejs'); //load the index.ejs file
});


// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login',{message: req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

//SIGN UP PAGE
app.get('/signup', (req, res) => {
    res.render('signup', {message: req.flash('signupMessage')});
});

app.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//PROFILE PAGE
app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {user: req.user});
});

//FACEBOOK AUTHENTICATION
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

//GOOGLE AUTHENTICATION
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect:'/profile',
    failureRedirect: '/'
}));

//LOGOUT

app.get('/logout', (req, res) => {
    req.logout();
     res.redirect('/');
});

};

function isLoggedIn(req, res, next)  {
    if(req.isAuthenticated())
        return next();

     res.redirect('/');
};