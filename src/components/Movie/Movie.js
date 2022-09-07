import React from 'react'
import { Card, Typography, Spin, Rate, Avatar } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import { decideRatingColor, cutOverview } from '../../helpers'
import MovieDBapi from '../../movieDBapi'
import './Movie.css'
import GenreList from '../GenreList/GenreList'
import { GenreConsumer } from '../GenreContext/GenreContext'

import noImage from './noimage.png'

const { Title, Paragraph, Text } = Typography

export default class Movie extends React.Component {
  state = {
    overviewHeight: 0,
    overviewWidth: 0,
    titleWidth: 0,
    img: null,
    stars: 0,
  }

  card = React.createRef()

  resizeObserver = new ResizeObserver((entryes) => {
    entryes.forEach((entry) => {
      setTimeout(() => {
        const card = entry.target
        const titleHeight = card.querySelector('.movie__title').scrollHeight
        const dateHeight = card.querySelector('.movie__date').scrollHeight
        const tagHeight = card.querySelector('.movie__genres').scrollHeight
        const overviewHeight = card.scrollHeight - tagHeight - dateHeight - titleHeight - 85
        const overviewWidth = card.querySelector('.ant-card-body').scrollWidth - 40
        const title = card.querySelector('.movie__title')
        const titleMarginLeft = parseInt(getComputedStyle(title).marginLeft, 10)
        const titleMarginRight = parseInt(getComputedStyle(title).marginRight, 10)
        const titleWidth = card.querySelector('.ant-card-body').scrollWidth - titleMarginLeft - titleMarginRight
        this.setState({ overviewHeight, overviewWidth, titleWidth })
      }, 200)
    })
  })

  componentDidMount() {
    const { movie } = this.props

    MovieDBapi.getPoster(movie.poster_path)
      .then((url) => this.setState({ img: url }))
      .catch(() => this.setState({ img: noImage }))

    try {
      const stars = JSON.parse(localStorage.getItem('stars'))
      if (stars[movie.id]) {
        this.setState({ stars: stars[movie.id] })
      }
    } catch {
      localStorage.setItem('stars', '{}')
    }

    this.resizeObserver.observe(this.card.current)
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect()
  }

  onRate = (value) => {
    const { movie } = this.props
    MovieDBapi.rateMovie(movie.id, value).then(() => {
      const stars = localStorage.getItem('stars')
      if (!stars) localStorage.setItem('stars', '{}')
      const newObject = JSON.parse(stars)
      newObject[movie.id] = value
      localStorage.setItem('stars', JSON.stringify(newObject))
      this.setState({ stars: value })
    })
  }

  render() {
    const { movie } = this.props
    const { overviewHeight, overviewWidth, titleWidth, img, stars } = this.state
    const cover = img ? <img className="cover" src={img} alt={movie.original_title} /> : <Spin />
    const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null
    return (
      <Card className="movie" cover={cover} bordered={false} ref={this.card}>
        <Title className="movie__title">{cutOverview(movie.title, 28, titleWidth, 28, 12)}</Title>
        <Avatar
          className="movie__rating"
          size={30}
          style={{
            borderColor: decideRatingColor(movie.vote_average),
          }}
        >
          {Math.round(movie.vote_average * 10) / 10}
        </Avatar>
        <Text className="movie__date">{date}</Text>
        <GenreConsumer>
          {(genresList) => <GenreList genresList={genresList} movieGenres={movie.genre_ids} />}
        </GenreConsumer>
        <Paragraph className="movie__overview">
          {cutOverview(movie.overview, overviewHeight, overviewWidth, 22, 7)}
        </Paragraph>
        <Rate className="movie__rate" allowHalf defaultValue={0} count={10} onChange={this.onRate} value={stars} />
      </Card>
    )
  }
}
