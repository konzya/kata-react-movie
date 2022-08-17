import React from 'react'
import { Input, Pagination } from 'antd'
import { debounce } from 'lodash'

import './App.css'
import MovieDBapi from '../../movieDBapi'
import MoviesList from '../MoviesList/MoviesList'

export default class App extends React.Component {
  state = {
    movies: null,
    loading: false,
    error: null,
    offline: false,
    searchInputValue: '',
    page: 0,
    totalItems: 0,
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ offline: true })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchInputValue, page } = this.state
    if (prevState.searchInputValue === searchInputValue && prevState.page === page) return
    if (searchInputValue === '') {
      this.getMovies.cancel()
      this.endLoading()
      return
    }
    this.startLoading()
    this.getMovies(searchInputValue, page)
  }

  onInputChange = (e) => {
    this.setState({
      searchInputValue: e.target.value,
      loading: true,
      movies: null,
      error: false,
      page: 1,
      totalItems: 0,
    })
  }

  onPaginationChange = (page) => this.setState({ page })

  getMovies = debounce((searchInputValue, page) => {
    MovieDBapi.getMovies(searchInputValue, page)
      .then((body) => {
        console.log(body)
        this.setState({
          movies: body.results,
          loading: false,
          totalItems: body.total_results,
        })
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
        })
      })
  }, 777)

  startLoading = () => this.setState({ loading: true })

  endLoading = () => this.setState({ loading: false })

  render() {
    const { movies, loading, error, offline, searchInputValue, page, totalItems } = this.state
    return (
      <section className="app">
        <Input className="app__search" value={searchInputValue} onChange={this.onInputChange} />
        <MoviesList movies={movies} loading={loading} error={error} offline={offline} />
        <Pagination
          className="app__pagination"
          current={page}
          total={totalItems}
          pageSize={20}
          hideOnSinglePage
          showSizeChanger={false}
          onChange={this.onPaginationChange}
        />
      </section>
    )
  }
}
