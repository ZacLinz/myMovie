import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './main-view.scss'

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

export class MainView extends React.Component{
  constructor(){
  super();

  this.state = {
    movies: null,
    selectedMovie: null,
    user: null
  };
  }

  getMovies(token) {
    axios.get('https://my-movie-108.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      this.setState({
        movies: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }



  componentDidMount(){
    window.addEventListener('hashchange', this.handleNewHash, false);
    this.handleNewHash();

    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

handleNewHash = () => {
  const movieId = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');

  this.setState({
    selectedMovieId: movieId[0]
  });
}

  onMovieClick(movie){
    window.location.hash = '#' + movie._id;
    this.setState({
      selectedMovie: movie._id
    })
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.username);
    this.getMovies(authData.token)
  }




  render(){
    const { movies, selectedMovie, user } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    if (!movies || !movies.length) return <div className="main-view"/>;
  const selectedMovie = selectedMovieId ? movies.find(m => m._id === selectedMovieId) : null;

    return(
      <div className="main-view">
      {selectedMovie
        ? <MovieView movie={selectedMovie}/>
        : movies.map(movie =>(
          <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
        ))
      }
      </div>
    )
  }
}
