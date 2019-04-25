import React from 'react';
import axios from 'axios';
//import PropTypes from 'prop-types';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component{
  constructor(){
    // call the superclass constructor
    // so that React can initialize it
  super();

  //initialize the state to an empty object so we can destructure it later
  this.state = {
    movies: null,
    selectedMovie: null,
    user: null
  };
  }

  // this will override the render() method of the superclass
  // don't need to call super() though
  /*render(){
    return (
      <div className="main-view"></div>
    );
  }*/

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
    // if the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, selectedMovie, user } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    // before the movies have been loaded
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
