import React from 'react'
import { Card, Typography, Spin, Rate, Avatar } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import cutOverview from '../../cutOverview'
import decideRatingColor from '../../decideRatingColor'
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
    img: null,
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
        this.setState({ overviewHeight, overviewWidth })
      }, 200)
    })
  })

  componentDidMount() {
    const { movie } = this.props

    MovieDBapi.getPoster(movie.poster_path)
      .then((url) => this.setState({ img: url }))
      .catch(() => this.setState({ img: noImage }))

    this.resizeObserver.observe(this.card.current)
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect()
  }

  onRate = (value) => {
    const { movie, setStars, getRatedMovies } = this.props
    MovieDBapi.rateMovie(movie.id, value).then(() => {
      const ratedMovies = localStorage.getItem('ratedMovies')
      if (!ratedMovies) localStorage.setItem('ratedMovies', '{}')
      const newObject = JSON.parse(ratedMovies)
      newObject[movie.id] = value
      localStorage.setItem('ratedMovies', JSON.stringify(newObject))
      setStars(newObject)
      setTimeout(() => getRatedMovies(), 1000)
    })
  }

  render() {
    const { movie, stars } = this.props
    const { overviewHeight, overviewWidth, img } = this.state
    const cover = img ? <img className="cover" src={img} alt={movie.original_title} /> : <Spin />
    const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null
    return (
      <Card className="movie" cover={cover} bordered={false} ref={this.card}>
        <Title className="movie__title">{movie.title}</Title>
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
        <Paragraph className="movie__overview">{cutOverview(movie.overview, overviewHeight, overviewWidth)}</Paragraph>
        <Rate className="movie__rate" allowHalf defaultValue={0} count={10} onChange={this.onRate} value={stars} />
      </Card>
    )
  }
}
