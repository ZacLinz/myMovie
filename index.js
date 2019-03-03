const express = require('express'),
  morgan = require('morgan')

const app = express();

var logger = function (req, res, next){
  console.log(req.url);
  next();
};

var timeStamp = function (req, res, next){
  console.log(Date.now());
  next();
}

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

app.use(logger);
app.use(timeStamp);
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('All the pretty things are broken!')
}),

app.get('/movies', function(req, res){
  res.json(topMovies)
});
app.get('/', function(req, res){
  res.send('Welcome to my favorite movie database!')
});

app.use(express.static('public'));

app.listen(8080, ()=>
  console.log('App is listening on port 8080')
);
