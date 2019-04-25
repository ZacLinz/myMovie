import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './main-view.scss'

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component{
  constructor(){
  super();

  this.state = {
    movies: null,
    selectedMovie: null,
    user: null
  };
  }

  componentDidMount(){
    axios.get('https://my-movie-108.herokuapp.com/movies')
      .then(response=>{
        //assign the result to the state
        this.setState({
          movies: response.data
        })
      })
      .catch(function(error){
        console.log(error);
      })
  }

  onMovieClick(movie){
    this.setState({
      selectedMovie: movie
    })
  }

  onLoggedIn(user) {
    this.setState({
      user
    })
  }

  render(){
    const { movies, selectedMovie, user } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    if (!movies) return <div className="main-view"/>;

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

/*MainView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string
  }).isRequired
};*/
