const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose');

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

mongoose.connect('mongodb://localhost:27017/myMovieDB', {useNewUrlParser: true});


const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('All the pretty things are broken!')
}),
app.use(express.static('public'));

//endpoint 1 returns a list of all movies
app.get('/movies', function(req, res){
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
app.get('/movies/:title', function(req, res){
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
app.get('/movies/genre/:name', function(req, res){
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
app.get('/directors/:name', function(req, res){
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
userName: String,
password: String,
email: String,
birthday: stringn,
*/
app.post('/users', function(req, res){
  Users.findOne({userName : req.body.userName})
  .then(function(user){
    if (user){
      return res.status(400).send(req.body.userName + "already exists");
    } else{
      Users
      .create({
        userName: req.body.userName,
        password: req.body.password,
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
app.put('/users/:userName', function(req, res){
  Users.update({userName: req.params.userName}, {$set:
  {
    userName: req.body.userName,
    password: req.body.password,
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

app.get('/users', (req, res)=>{
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
app.post('/users/:userName/favorites/:movieID', function(req, res){
  Users.findOneAndUpdate({userName: req.params.userName},{
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
app.delete('/users/:userName/favorites/:movieID', function(req, res){
  Users.findOneAndUpdate({userName: req.params.userName},{
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
app.delete('/users/:userName', function(req, res){
  Users.findOneAndRemove({userName: req.params.userName})
  .then(function(user){
    if (!user){
      res.status(400).send(req.params.userName + " was not found.");
    } else{
      res.status(200).send(req.params.userName + " was deleted");
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



app.listen(8080, ()=>
  console.log('App is listening on port 8080')
);
