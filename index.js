const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

let topMovies =[{
  title: 'The Incredibles',
  director: 'Brad Bird'
},
{
  title: 'The Mummy',
  director: 'Alex Kurtzman'
},
{
  title: 'Batman Begins',
  director: 'Christopher Nolan'
},
{
  title: 'The Dark Knight',
  director: 'Christopher Nolan'
},
{
  title: 'The Dark Knight Rises',
  director: 'Christopher Nolan'
},
{
  title: 'The Truman Show',
  director: 'Peter Weir'
},
{
  title: 'What We Do in the Shadows',
  director: 'Jemaine Clement'
},
{
  title: 'Nausicaa of the Valley of the Wind',
  director: 'Hayao Miyazaki'
},
{
  title: 'The Lion King',
  director: 'Roger Allers'
}];
let users =[{
  userName: 'User_name',
  password: 'sample password',
  email: 'sample@mail.com',
  birthday: 'mm/dd/yyyy'
}]

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('All the pretty things are broken!')
}),
app.use(express.static('public'));

//endpoint 1
app.get('/movies', function(req, res){
  res.json(topMovies)
});
//endpoint 2
app.get('/movies/:title', function(req, res){
  res.json(topMovies.find((movie)=>{
    return movie.title.toLowerCase() === req.params.title
  }));
});
//endpoint 3 add semicolon to path later
app.get('/movies/genre', function(req, res){
  res.send('Succesful get request about a specific genre.')
});
//endpoint 4 need to add array on directors specifically
app.get('/movies/director', function(req, res){
  res.send('Succesful GET request about a director.')
});
//endpoint 5
app.post('/users', function(req, res){
  let newUser = req.body;

  users.push(newUser);
  res.send('new user succesfully added!');
})
//endpoint 6 I want to require the username and password but only able to change email/birthday
app.put('/users/userName/password/email', function(req, res){
  res.send('information succesfully updated!')
})

//endpoint 7
app.put('/users/userName/favorites/movie', function(req, res){
  res.send('movie added to favorites')
})

//endpoint 8
app.delete('/users/userName/favorites/movie', function(req, res){
  res.send('movie removed from favorites')
})
//endpoint 9
app.delete('/users/userName/password/deregister', function(req, res){
  res.send('user succesfully deleted from app')
})

app.get('/documentation', function(req, res){
  res.sendFile('public/documentation.html', {root: __dirname})
})

app.get('/', function(req, res){
  res.send('Welcome to my favorite movie database!')
});



app.listen(8080, ()=>
  console.log('App is listening on port 8080')
);
