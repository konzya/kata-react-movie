import React from 'react'
import { Pagination, Spin, Alert } from 'antd'
import { debounce } from 'lodash'

import MoviesList from '../MoviesList/MoviesList'
import MovieDBapi from '../../movieDBapi'

export default class RatedPage extends React.Component {
  state = {
    movies: [],
    totalMovies: 0,
    paginationValue: localStorage.getItem('ratedPageData')
      ? JSON.parse(localStorage.getItem('ratedPageData')).paginationValue
      : 1,
    error: null,
    loading: false,
  }

  componentDidMount() {
    const { paginationValue } = this.state
    this.startLoading()
    this.getMovies(paginationValue)
  }

  componentDidUpdate(prevProps, prevState) {
    const { paginationValue } = this.state
    if (paginationValue !== prevState.paginationValue) {
      this.startLoading()
      this.getMovies(paginationValue)
    }
  }

  onPaginationChange = (paginationValue) => this.setState({ paginationValue })

  getMovies = debounce((page) => {
    MovieDBapi.getRatedMovies(page)
      .then((body) => {
        this.setState({ movies: body.results, loading: false, totalMovies: body.total_results })
        this.saveState()
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
        })
      })
  }, 777)

  startLoading = () => {
    this.setState({
      loading: true,
      movies: [],
      totalMovies: 0,
      error: null,
    })
  }

  saveState = () => {
    const { paginationValue } = this.state
    let state = {
      paginationValue,
    }
    state = JSON.stringify(state)
    localStorage.setItem('ratedPageData', state)
  }

  render() {
    const { paginationValue, totalMovies, movies, error, loading } = this.state

    return (
      <main className="app__page">
        {loading ? <Spin className="spinner" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MoviesList movies={movies} />
        <Pagination
          className="app__pagination"
          current={paginationValue}
          total={totalMovies}
          pageSize={20}
          hideOnSinglePage
          showSizeChanger={false}
          onChange={this.onPaginationChange}
        />
      </main>
    )
  }
}
