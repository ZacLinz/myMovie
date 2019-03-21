const mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: {
    name: String,
    description: String
  },
  director:{
    name: String,
    bio: String
  },
});

var userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password:{type: String, required: true},
  email:{type: String, required: true},
  birthday: Date,
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
});

var directorSchema = mongoose.Schema({
  name: String,
  bio: String,
  birth: String,
  death: String
});

var genreSchema = mongoose.Schema({
  name: String,
  description: String
})

var Movie = mongoose.model('Movie', movieSchema);
var User = mongoose.model('User', userSchema);
var Director = mongoose.model('Director', directorSchema);
var Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
