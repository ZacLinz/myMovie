const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

let topMovies =[{
  title: 'The Incredibles',
  director:{
    name: 'Brad Bird',
    bio: 'https://www.imdb.com/name/nm0083348/bio',
    birthYear: '1957',
    deathYear: '',
  },
  genre: [' animation', ' action', ' adventure', ' family']
},
{
  title: 'The Mummy',
  director: {
    name:'Alex Kurtzman',
    bio:'https://www.imdb.com/name/nm0476064/',
    birthYear: '1973',
    deathYear: ''
  },
  genre: [' action', ' adventure']
},
{
  title: 'Batman Begins',
  director:{
    name: 'Christopher Nolan',
    bio: 'https://www.imdb.com/name/nm0634240/bio',
    birthYear: '1970',
    deathYear: ''
  },
  genre: [' super hero', ' action']
},
{
  title: 'The Dark Knight',
  director:{
    name: 'Christopher Nolan',
    bio: 'https://www.imdb.com/name/nm0634240/bio',
    birthYear: '1970',
    deathYear: ''
  },
  genre: [' super hero',  ' action']
},
{
  title: 'The Dark Knight Rises',
  director:{
    name: 'Christopher Nolan',
    bio: 'https://www.imdb.com/name/nm0634240/bio',
    birthYear: '1970',
    deathYear: ''
  },
  genre: [' super hero', ' action']
},
{
  title: 'The Truman Show',
  director:{
    name: 'Peter Weir',
    bio: 'https://www.imdb.com/name/nm0001837/bio',
    birthYear: '1944',
    deathYear: '',
  },
  genre: [ 'mystery', ' reality']
},
{
  title: 'What We Do in the Shadows',
  director: {
    name:'Jemaine Clement',
    bio: 'https://www.imdb.com/name/nm1318596/bio',
    birthYear: '1974',
    deathYear:''
  },
  genre: [' comedy', ' super natural']
},
{
  title: 'Nausicaa of the Valley of the Wind',
  director: {
    name:'Hayao Miyazaki',
    bio: 'https://www.imdb.com/name/nm0594503/bio',
    birthYear: '1941',
    deathYear: ''
  },
  genre:[' animation']
},
{
  title: 'The Lion King',
  director: {
    name:'Roger Allers',
    bio: 'https://www.imdb.com/name/nm0021249/bio',
    birthYear: '1949',
    deathYear: ''
  },
  genre: [' animation', ' musical', ' animal', ' family']
}];


let backupDirectors =[{
  name: 'Brad Bird',
  bio: 'https://www.imdb.com/name/nm0083348/bio',
  birthYear: '1957',
  deathYear: '',
},
{
  name:'Alex Kurtzman',
  bio:'https://www.imdb.com/name/nm0476064/',
  birthYear: '1973',
  deathYear: ''
},
{
  name: 'Christopher Nolan',
  bio: 'https://www.imdb.com/name/nm0634240/bio',
  birthYear: '1970',
  deathYear: ''
},
{
  name: 'Peter Weir',
  bio: 'https://www.imdb.com/name/nm0001837/bio',
  birthYear: '1944',
  deathYear: '',
},
{
  name:'Jemaine Clement',
  bio: 'https://www.imdb.com/name/nm1318596/bio',
  birthYear: '1974',
  deathYear:''
},
{
  name:'Hayao Miyazaki',
  bio: 'https://www.imdb.com/name/nm0594503/bio',
  birthYear: '1941',
  deathYear: ''
},
{
  name:'Roger Allers',
  bio: 'https://www.imdb.com/name/nm0021249/bio',
  birthYear: '1949',
  deathYear: ''
}]


let users =[{
  userName: 'User_name',
  password: 'sample_password',
  email: 'sample@mail.com',
  birthday: 'mm/dd/yyyy',
  favoriteMovies: ['the incredibles']
}]

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('All the pretty things are broken!')
}),
app.use(express.static('public'));

//endpoint 1 returns a list of all movies
app.get('/movies', function(req, res){
  res.json(topMovies)
});

//endpoint 2 returns infomation about a single movie
app.get('/movies/:title', function(req, res){
  res.json(topMovies.find((movie)=>{
    return movie.title.toLowerCase() === req.params.title.toLowerCase()
  }));
});

//endpoint 3 add semicolon to path later
app.get('/movies/genre/:title', function(req, res){
  topMovies.find((movie) => {
    if (movie.title.toLowerCase() === req.params.title.toLowerCase()){
      return res.json(movie.genre.join(''));
    }
  })
});


//endpoint 4 returns data about a director
app.get('/directors/:name', function(req, res){
  res.json(backupDirectors.find((person) => {
    return person.name.toLowerCase() === req.params.name.toLowerCase()
  }));
});


//endpoint 5
app.post('/users', function(req, res){
  let newUser = req.body;

  users.push(newUser);
  res.send('new user succesfully added!');
})

app.get('/users', (req, res)=>{
  res.json(users);
})

//endpoint 6
app.put('/users/:userName/:password/:email/:birthday', function(req, res){
  users.find((user) => {
    if (user.userName === req.params.userName){
      users.password = req.params.password;
      users.email = req.params.email;
      users.birthday = req.params.birthday;
      res.status(201).send('information succesfully updated!')
    }
    else
      res.status(404).send('unable to update information');
    })
  })

//endpoint 7
app.put('/users/:userName/favorites/:movie', function(req, res){
  users.find((user) => {
    if (user.userName === req.params.userName){
      user.favoriteMovies.push(req.params.movie);
      res.status(201).send('movie added to favorites')
    }
    else{
      res.status(400).send('unable to add movie to favorites')
    }
  })
})

//endpoint 8
app.delete('/users/:userName/favorites/:movie', function(req, res){
  let favorites = users.find((user)=>{return user.userName === req.params.userName})
    if (favorites){
      users.favoriteMovies.filter((obj) => {return obj.movie !== req.params.movie});
      res.status(201).send('movie removed from favorites')
    }
    else {
      res.status(401).send('unable to remove from favorites');
    }
  })

//endpoint 9
app.delete('/users/:userName/:password/deregister', function(req, res){
  users.find((user) => {
    if (user.userName === req.params.userName || user.password === req.params.password){
      users.filter((obj)=>{return obj.userName !== req.params.userName})
      res.send('user successfully deleted from app')
    }
  })
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
