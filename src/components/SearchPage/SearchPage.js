import React from 'react'
import { Input, Pagination, Spin, Alert } from 'antd'
import { debounce } from 'lodash'

import MoviesList from '../MoviesList/MoviesList'
import MovieDBapi from '../../movieDBapi'

export default class SearchPage extends React.Component {
  state = {
    movies: [],
    searchInputValue: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).searchInputValue
      : '',
    totalMovies: 0,
    paginationValue: localStorage.getItem('searchPageData')
      ? JSON.parse(localStorage.getItem('searchPageData')).paginationValue
      : 1,
    error: null,
    loading: false,
  }

  componentDidMount() {
    const { searchInputValue, paginationValue } = this.state
    if (searchInputValue) {
      this.startLoading()
      this.getMovies(searchInputValue, paginationValue)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchInputValue, paginationValue } = this.state
    if (searchInputValue !== prevState.searchInputValue || paginationValue !== prevState.paginationValue) {
      if (!searchInputValue) {
        this.stopLoading()
        this.getMovies.cancel()
        return
      }
      this.startLoading()
      this.getMovies(searchInputValue, paginationValue)
    }
  }

  onInputChange = (e) => this.setState({ searchInputValue: e.target.value, paginationValue: 1 })

  onPaginationChange = (paginationValue) => this.setState({ paginationValue })

  getMovies = debounce((searchInputValue, page) => {
    MovieDBapi.getMovies(searchInputValue, page)
      .then((body) => {
        this.setState({
          movies: body.results,
          totalMovies: body.total_results,
          loading: false,
        })
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

  stopLoading = () => {
    this.setState({
      loading: false,
      movies: [],
      totalMovies: 0,
      error: null,
    })
  }

  saveState = () => {
    const { paginationValue, searchInputValue } = this.state
    let state = {
      paginationValue,
      searchInputValue,
    }
    state = JSON.stringify(state)
    localStorage.setItem('searchPageData', state)
  }

  render() {
    const { searchInputValue, paginationValue, totalMovies, movies, error, loading } = this.state

    return (
      <main className="app__page">
        <Input className="app__search" value={searchInputValue} onChange={this.onInputChange} />
        {loading ? <Spin className="spinner" size="large" /> : null}
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <MoviesList movies={movies} />
        <Pagination
          className="app__pagination"
          current={paginationValue}
          total={totalMovies}
          pageSize={20}
          size="small"
          hideOnSinglePage
          showSizeChanger={false}
          onChange={this.onPaginationChange}
        />
      </main>
    )
  }
}
