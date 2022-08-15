import React from 'react'

import './App.css'
import MovieDBapi from '../../movieDBapi'
import MoviesList from '../MoviesList/MoviesList'

export default class App extends React.Component {
  state = {
    movies: null,
    loading: true,
    error: null,
    offline: false,
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ offline: true })
    })
    setTimeout(() => {
      MovieDBapi.getMovies('bone')
        .then((body) => {
          console.log(body)
          this.setState({
            movies: body.results,
            loading: false,
          })
        })
        .catch((error) => {
          this.setState({
            error,
            loading: false,
          })
        })
    }, 1000)
  }

  render() {
    const { movies, loading, error, offline } = this.state
    return <MoviesList movies={movies} loading={loading} error={error} offline={offline} />
  }
}
