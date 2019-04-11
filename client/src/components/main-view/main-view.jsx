import React from 'react';
import axios from 'axios';

class MainView extends React.Component {
  constructor(){
    // call the superclass constructor
    // so that React can initialize it
  super();

  //initialize the state to an empty object so we can destructure it later
  this.state = {};
  }

  // this will override the render() method of the superclass
  // don't need to call super() though
  render(){
    return (
      <div className="main-view"></div>
    );
  }
}

export class MainView extends React.Component{

  componentDidMount(){
    axios.get('<https://my-movie-108.herokuapp.com/movies>')
      .then(response => {
        //assign the result to the state
        this.setState({
          movies: response.data
        })
      })
      .catch(function(error){
        console.log(error);
      })
  }

  render(){
    // if the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies } = this.state;

    // before the movies have been loaded
    if (!movies) return <div className="main-view"/>;

    return(
      <div className="main-view">
      {movies.map(movie => (
        <div classname="movie-card" key={movie._id}>{movie.title}</div>
      ))}
      </div>
    )
  }
}
