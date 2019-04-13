import React from 'react';

export class MovieView extends React.Component{
  constructor(){
    super();

    this.state={};
  }
  render(){
    const {movie} = this.props;

    if (!movie) return null;

    return(
      <div className="movie-view">
        <div className="movie-title">
          <div className="label">Title</div>
          <div className="value">{movie.title}</div>
        </div>
        <div className="movie-description">
          <div className="label">Description</div>
          <div className="value">{movie.description}</div>
        </div>
        <img className="movie-poster" src ={movie.ImagePath}></img>
        <div className="movie-genre">
          <div className="label">Genre</div>
          <div className="value">{movie.genre.name}</div>
        </div>
        <div className="movie-director">
          <div className="label">Director</div>
          <div className="value">{movie.director.name}</div>
        </div>
      </div>

    );
  }
}
