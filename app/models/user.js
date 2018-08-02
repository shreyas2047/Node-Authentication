// Load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Schema for our user model.
var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

// Generating a Hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = (password, localpassword) => {
    return bcrypt.compareSync(password, localpassword);
};

//Create the model for user and expose it to the app.
module.exports = mongoose.model('User', userSchema);