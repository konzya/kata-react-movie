import React from 'react'
import { Input, Pagination, Menu } from 'antd'
import { debounce } from 'lodash'

import './App.css'
import MovieDBapi from '../../movieDBapi'
import MoviesList from '../MoviesList/MoviesList'
import { GenreProvider } from '../GenreContext/GenreContext'

export default class App extends React.Component {
  state = {
    movies: null,
    ratedMovies: null,
    loading: false,
    error: null,
    offline: false,
    searchInputValue: '',
    paginatorMovieValue: 1,
    totalMovies: 0,
    paginatorRateValue: 1,
    totalRateMovies: 0,
    page: 'search',
    stars: null,
    genres: null,
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ offline: true })
    })
    window.addEventListener('online', () => {
      this.setState({ offline: false })
    })
    MovieDBapi.guestSessionInit()
    this.loadStars()
    this.getRatedMovies(1)
    this.getGenres()
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchInputValue, paginatorMovieValue, paginatorRateValue } = this.state

    if (prevState.searchInputValue !== searchInputValue || prevState.paginatorMovieValue !== paginatorMovieValue) {
      if (searchInputValue === '') {
        this.getMovies.cancel()
        this.endLoading()
        return
      }
      this.startLoading()
      this.getMovies(searchInputValue, paginatorMovieValue)
      window.scrollTo(0, 0)
    }

    if (prevState.paginatorRateValue !== paginatorRateValue) {
      this.startLoading()
      this.getRatedMovies(paginatorRateValue)
      window.scrollTo(0, 0)
    }
  }

  onInputChange = (e) => {
    this.setState({
      searchInputValue: e.target.value,
      loading: true,
      movies: null,
      error: false,
      paginatorMovieValue: 1,
      totalMovies: 0,
    })
  }

  onPaginationChange = (paginatorValue) => {
    const { page } = this.state
    switch (page) {
      case 'search':
        this.setState({ paginatorMovieValue: paginatorValue })
        break
      case 'rated':
        this.setState({ paginatorRateValue: paginatorValue })
        break
      default:
        break
    }
  }

  onMenuSelect = ({ key }) => {
    this.setState({ page: key })
  }

  getMovies = debounce((searchInputValue, page) => {
    MovieDBapi.getMovies(searchInputValue, page)
      .then((body) => {
        console.log(body)
        this.setState({
          movies: body.results,
          loading: false,
          totalMovies: body.total_results,
        })
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
        })
      })
  }, 777)

  getRatedMovies = () => {
    const { paginatorRateValue } = this.state
    MovieDBapi.getRatedMovies(paginatorRateValue)
      .then((body) => {
        this.setState({ ratedMovies: body.results, loading: false, totalRateMovies: body.total_results })
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
        })
      })
  }

  loadStars = () => {
    const stars = localStorage.getItem('ratedMovies')
    if (!stars) localStorage.setItem('ratedMovies', '{}')
    this.setStars(JSON.parse(stars))
  }

  setStars = (obj) => {
    this.setState({ stars: obj })
  }

  getGenres = () => {
    MovieDBapi.getGenres()
      .then((genres) => this.setState({ genres }))
      .catch((error) => this.setState({ error }))
  }

  startLoading = () => this.setState({ loading: true })

  endLoading = () => this.setState({ loading: false })

  render() {
    const {
      movies,
      loading,
      error,
      offline,
      searchInputValue,
      page,
      totalMovies,
      paginatorMovieValue,
      ratedMovies,
      paginatorRateValue,
      totalRateMovies,
      stars,
      genres,
    } = this.state

    const menu = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ]

    return (
      <GenreProvider value={genres}>
        <section className="app">
          <Menu
            className="app__menu"
            items={menu}
            mode="horizontal"
            selectedKeys={[page]}
            onSelect={this.onMenuSelect}
          />
          {page === 'search' ? (
            <Input className="app__search" value={searchInputValue} onChange={this.onInputChange} />
          ) : null}
          <MoviesList
            movies={page === 'search' ? movies : ratedMovies}
            stars={stars}
            loading={loading}
            error={error}
            offline={offline}
            setStars={this.setStars}
            getRatedMovies={this.getRatedMovies}
          />
          <Pagination
            className="app__pagination"
            current={page === 'search' ? paginatorMovieValue : paginatorRateValue}
            total={page === 'search' ? totalMovies : totalRateMovies}
            pageSize={20}
            hideOnSinglePage
            showSizeChanger={false}
            onChange={this.onPaginationChange}
          />
        </section>
      </GenreProvider>
    )
  }
}
