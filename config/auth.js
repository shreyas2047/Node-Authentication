module.exports = {
    'facebookAuth': {
        'clientID': '188727468423908',
        'clientSecret': 'f9f2e3c9239249734b31fd6fdf904329',
        'callbackURL': 'https://localhost:4000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['id', 'email', 'name']
    },
    'googleAuth': {
        'clientID': '27200307637-mbesv5oclhi92h73fi0t9fpd6ush89bf.apps.googleusercontent.com',
        'clientSecret': 'BeqRnyuSbAY6NkCq5OBDKYTp',
        'callbackURL': 'http://localhost:4000/auth/google/callback'
    }
};