
const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  passportjs = require('./passport.js'),
  cors = require('cors'),
  validator = require('express-validator');



const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

var auth = require('./auth.js')(app);

//mongoose.connect('mongodb://localhost:27017/myMovieDB', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://myMovieAdmin:persona5@mymovie-j8mo3.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());
app.use(validator());

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('All the pretty things are broken!')
}),
app.use(express.static('public'));

//endpoint 1 returns a list of all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), function(req, res){
  Movies.find()
  .then(function(movies){
    res.status(201).json(movies)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

//endpoint 2 returns infomation about a single movie
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), function(req, res){
  Movies.findOne({title: req.params.title})
  .then(function(movie){
    res.json(movie)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

//endpoint 3 return data about a genre
app.get('/movies/genre/:name', passport.authenticate('jwt', {session: false}), function(req, res){
  Genres.find({name: req.params.name})
  .then(function(genre){
    res.json(genre)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});


//endpoint 4 returns data about a director
app.get('/directors/:name', passport.authenticate('jwt', {session: false}), function(req, res){
  Directors.find({name: req.params.name})
  .then(function(person){
    res.json(person)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});


//endpoint 5 allow users to register
/* json expected in this format
ID : Integer,
username: String,
password: String,
email: String,
birthday: stringn,
*/
app.post('/users', function(req, res){
  //validation
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('username', 'username contains non alphanumeric characters.').isAlphanumeric();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email does not appear to be valid.').isEmail();

  var errors = req.validationErrors();

  if (errors){
    return res.status(422).json({errors: errors});
  }

  var hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({username : req.body.username})
  .then(function(user){
    if (user){
      return res.status(400).send(req.body.username + "already exists");
    } else{
      Users
      .create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error){
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(err){
      console.error(err);
      res.status(500).send("Error: " + err);
    })
  });


//endpoint 6 allow users to update information by userName
/*json like this:
{
  userName: String, (required),
  password: String, (required),
  email: String, (required),
  birthday: Date
}*/
app.put('/users/:username', passport.authenticate('jwt', {session: false}), function(req, res){
  var hashedPassword = Users.hashPassword(req.body.password)
  Users.update({username: req.params.username}, {$set:
  {
    userName: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    birthday: req.body.birthday
  }},
  {new: true},
  function(err, updatedUser){
    if(err){
      console.error(err);
      res.status(500).send("Error: " + err);
    }else{
      res.json(updatedUser)
    }
  })
})

app.get('/users', passport.authenticate('jwt', {session: false}), (req, res)=>{
  Users.find()
  .then(function(users){
    res.status(201).json(users)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});



//endpoint 7 add to a movie to a list of users favorties
app.post('/users/:username/favorites/:movieID', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.findOneAndUpdate({username: req.params.username},{
    $push: {favorites: req.params.movieID}
  },
  {new: true},
  function(err, updatedUser){
    if (err){
      console.error(err);
      res.status(500).send("Error: " + err);
    }else{
      res.json(updatedUser)
    }
  })
});

//endpoint 8 allow a user to remove a movie from their list of favorites
app.delete('/users/:username/favorites/:movieID', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.findOneAndUpdate({username: req.params.username},{
    $pull:{favorites: req.params.movieID},
  },
  {new: true},
  function(err, updatedUser){
    if (err){
      console.error(err);
      res.status(500).send("Error: " + err);
    }else{
      res.json(updatedUser)
    }
  })
});

//endpoint 9 allows users to delete themselves
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.findOneAndRemove({username: req.params.username})
  .then(function(user){
    if (!user){
      res.status(400).send(req.params.username + " was not found.");
    } else{
      res.status(200).send(req.params.username + " was deleted");
    }
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

app.get('/documentation', function(req, res){
  res.sendFile('public/documentation.html', {root: __dirname})
})

app.get('/', function(req, res){
  res.send('Welcome to my favorite movie database!')
});

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function(){
  console.log('App is listening on port 3000')
});
=======

const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  passportjs = require('./passport.js'),
  validator = require('express-validator');

const cors = require('cors');
var allowedOrigins = ['http://my-movie-app-108.herokuapp.com', 'https://my-movie-app-108.herokuapp.com', 'http://localhost:3000']
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

var auth = require('./auth.js')(app);

//mongoose.connect('mongodb://localhost:27017/myMovieDB', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://myMovieAdmin:persona5@mymovie-j8mo3.mongodb.net/myMovieDB?retryWrites=true', {useNewUrlParser: true});

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(validator());

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('All the pretty things are broken!')
}),
app.use(express.static('public'));


/**
*endpoint 1 returns a list of all movies
*endpoint URL: /movies
*GET request
*no required params
*example request:
*@function getMovies(token) {
*  axios
*    .get("https://my-movie-108.herokuapp.com/movies", {
*      headers: { Authorization: `Bearer ${token}` }
*    })
*    .then(response => {
*      this.props.setMovies(response.data);
*    })
*    .catch(function(error) {
*      console.log(error);
*    });
*}
*example response:

*@param {string} _id
*@param {string}title
*@param {string}description
*@param {object} director
*@param {object} genre
*/

app.get('/movies', passport.authenticate('jwt', {session: false}), function(req, res){
  Movies.find()
  .then(function(movies){
    res.status(201).json(movies)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});


app.get('/movies/:title', passport.authenticate('jwt', {session: false}), function(req, res){
  Movies.findOne({title: req.params.title})
  .then(function(movie){
    res.json(movie)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

app.get('/movies/genre/:name', passport.authenticate('jwt', {session: false}), function(req, res){
  Genres.find({name: req.params.name})
  .then(function(genre){
    res.json(genre)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});


app.get('/directors/:name', passport.authenticate('jwt', {session: false}), function(req, res){
  Directors.find({name: req.params.name})
  .then(function(person){
    res.json(person)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

/**
*endpoint 2 allow users to register
*endpoint URL: /users
*POST request
*params required:
*@params {string} username
*@params {string} password
*@params {string} email
*@params {date} birthday
*@constant handleSubmit
*example request:
*@function handleSubmit = (e) => {
*  e.preventDefault();
*  axios.post('https://my-movie-108.herokuapp.com/users', {
*      username: username,
*      email: email,
*      birthday: birthday,
*      password: password,
*      confirmPassword: confirmPassword
*  })
*  .then(response =>{
*    const data = response.data;
*    console.log(data);
*    window.location.assign('/');
*  })
*  .catch(e => {
*    console.log('error registering the user')
*  });
*}
*example response:
*@param {object} user
*@params {string} username
*@params {string} password
*@params {string} email
*@params {date} birthday
*/
app.post('/users', function(req, res){
  //validation
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('username', 'username contains non alphanumeric characters.').isAlphanumeric();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email does not appear to be valid.').isEmail();

  var errors = req.validationErrors();

  if (errors){
    return res.status(422).json({errors: errors});
  }

  var hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({username : req.body.username})
  .then(function(user){
    if (user){
      return res.status(400).send(req.body.username + "already exists");
    } else{
      Users
      .create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error){
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(err){
      console.error(err);
      res.status(500).send("Error: " + err);
    })
  });


  /**
  *endpoint 6 allow users to update information
  *endpoint URL: /users/:username
  *PUT request
  *@params {string} username
  *@params {string} password
  *@params {string} email
  *@params {date} birthday
  *example request:
  *@function handleUpdate(token) {
  *  const { user } = this.props;
  *  const { username, email, birthday, password, confirmPassword } = this.state;
  *  axios({
  *    method: "put",
  *    url: `https://my-movie-108.herokuapp.com/users/${user.username}`,
  *    headers: {
  *      Authorization: `Bearer ${token}`
  *    },
  *    data: {
  *      username: username,
  *      email: email,
  *      birthday: birthday,
  *      password: password,
  *      confirmPassword: confirmPassword
  *    }
  *  })
  *    .then(response => {
  *      //const data = response.data;
  *      localStorage.removeItem("token");
  *      localStorage.removeItem("user");
  *      window.location.reload();
  *    })
  *    .catch(e => {
  *      console.log("error updating the user");
  *    });
  *}
  *example response:
  *@param {object} user
  *@params {string} username
  *@params {string} password
  *@params {string} email
  *@params {date} birthday
  */
app.put('/users/:username', passport.authenticate('jwt', {session: false}), function(req, res){
  var hashedPassword = Users.hashPassword(req.body.password)
  Users.update({username: req.params.username}, {$set:
  {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    birthday: req.body.birthday
  }},
  {new: true},
  function(err, updatedUser){
    if(err){
      console.error(err);
      res.status(500).send("Error: " + err);
    }else{
      res.json(updatedUser)
    }
  })
})

app.get('/users', passport.authenticate('jwt', {session: false}), (req, res)=>{
  Users.find()
  .then(function(users){
    res.status(201).json(users)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});



/**
*endpoint 7 add a movie to users favorites
*endpoint URL: /users/:username/favorites/:movieID
*POST request
*@params {ObjectId} _id
*@params {string} user
*@function addToFavorites() {
*  const { movie} = this.props;
*  const user = localStorage.getItem("user");
*  const token = localStorage.getItem("token");
*  console.log({ token });
*  axios
*    .post(
*      `https://my-movie-108.herokuapp.com/users/${user}/favorites/${
*        movie._id
*      }`,
*      null,
*      { headers: { Authorization: `Bearer ${token}` } }
*    )
*    .then(res => {
*      console.log(res);
*      window.location.reload();
*    })
*    .catch(error => {
*      console.log(error);
*    });
*}
*example response:
* Json of users updated list of favorites
*/
app.post('/users/:username/favorites/:movieID', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.findOneAndUpdate({username: req.params.username},{
    $push: {favorites: req.params.movieID}
  },
  {new: true},
  function(err, updatedUser){
    if (err){
      console.error(err);
      res.status(500).send("Error: " + err);
    }else{
      res.json(updatedUser)
    }
  })
});

/**
*endpoint 8 delete a movie from users list of favorites
*endpoint URL: /users/:username/favorites/:movieID
*DELETE request
*@params {ObjectId} _id
*@params {string} user
*example request:
removeFavorite(id, token) {
  const { favorites } = this.props;
  const { user } = this.props;
  axios.delete(
    `https://my-movie-108.herokuapp.com/users/${user.username}/favorites/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log(res);
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
}
*example response:
* Json of users updated list of favorites
*/
app.delete('/users/:username/favorites/:movieID', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.findOneAndUpdate({username: req.params.username},{
    $pull:{favorites: req.params.movieID},
  },
  {new: true},
  function(err, updatedUser){
    if (err){
      console.error(err);
      res.status(500).send("Error: " + err);
    }else{
      res.json(updatedUser)
    }
  })
});

/**
*endpoint 9 delete a user
*endpoint URL: /users/:username
*DELETE request
*@params {string} user
*example request:
*@function handleDelete(token) {
*  const { user } = this.props;
*  axios
*    .delete(`https://my-movie-108.herokuapp.com/users/${user.username}`, {
*      headers: { Authorization: `Bearer ${token}` }
*    })
*    .then(res => {
*      localStorage.removeItem("token");
*      localStorage.removeItem("user");
*      window.location.reload();
*    })
*    .catch(error => {
*      console.log(error);
*    });
*}
*example response:
* username was deleted
*/
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.findOneAndRemove({username: req.params.username})
  .then(function(user){
    if (!user){
      res.status(400).send(req.params.username + " was not found.");
    } else{
      res.status(200).send(req.params.username + " was deleted");
    }
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

app.get('/users/:username/favorites', passport.authenticate('jwt', {session: false}), function(req, res){
  Users.find({username: req.params.username})
  .then(function(favorites){
    res.json(favorites)
  })
  .catch(function(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  })
});

app.get('/documentation', function(req, res){
  res.sendFile('public/documentation.html', {root: __dirname})
})

app.get('/', function(req, res){
  res.send('Welcome to my favorite movie database!')
});

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function(){
  console.log('App is listening on port 3000')
});
