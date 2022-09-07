import React from 'react'
import { Menu, Alert } from 'antd'

import './App.css'
import MovieDBapi from '../../movieDBapi'
import { GenreProvider } from '../GenreContext/GenreContext'
import SearchPage from '../SearchPage/SearchPage'
import RatedPage from '../RatedPage/RatedPage'

export default class App extends React.Component {
  state = {
    error: null,
    currentPage: 'search',
    genres: null,
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.setState({ error: new Error('no internet') })
    })
    window.addEventListener('online', () => {
      this.setState({ error: null })
    })
    MovieDBapi.guestSessionInit()
    this.getGenres()
  }

  onMenuSelect = ({ key }) => {
    this.setState({ currentPage: key })
  }

  getGenres = () => {
    MovieDBapi.getGenres()
      .then((genres) => this.setState({ genres }))
      .catch((error) => this.setState({ error }))
  }

  render() {
    const { error, currentPage, genres } = this.state

    const menu = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ]
    let body

    switch (currentPage) {
      case 'search':
        body = <SearchPage />
        break
      case 'rated':
        body = <RatedPage />
        break

      default:
        break
    }

    return (
      <GenreProvider value={genres}>
        {error ? <Alert message={error.message} type="error" showIcon /> : null}
        <section className="app">
          <Menu
            className="app__menu"
            items={menu}
            mode="horizontal"
            selectedKeys={[currentPage]}
            onSelect={this.onMenuSelect}
          />
          {body}
        </section>
      </GenreProvider>
    )
  }
}
