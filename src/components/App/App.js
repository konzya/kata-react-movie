import React from 'react'

import './App.css'
import MovieDBapi from '../../movieDBapi'
import MoviesList from '../MoviesList/MoviesList'

export default class App extends React.Component {
  state = {
    movies: null,
  }

  componentDidMount() {
    MovieDBapi.getMovies('bone').then((body) => {
      this.setState({
        movies: body.results,
      })
    })
  }

  render() {
    const { movies } = this.state
    return <MoviesList movies={movies} />
  }
}
MovieDBapi.getMovies('bone').then((body) => console.log(body))
