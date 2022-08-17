import React from 'react'
import { Card, Typography, Tag, Spin } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import cutOverview from '../../cutOverview'
import MovieDBapi from '../../movieDBapi'

import './Movie.css'
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
        const tagHeight = card.querySelector('.movie__tag').scrollHeight
        const overviewHeight = card.scrollHeight - tagHeight - dateHeight - titleHeight - 85
        const overviewWidth = card.querySelector('.ant-card-body').scrollWidth - 40
        this.setState({ overviewHeight, overviewWidth })
      }, 0)
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

  render() {
    const { movie } = this.props
    const { overviewHeight, overviewWidth, img } = this.state
    const cover = img ? <img className="cover" src={img} alt={movie.original_title} /> : <Spin />
    const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : 'Unknown'

    return (
      <Card className="movie" cover={cover} bordered={false} ref={this.card}>
        <Title className="movie__title">{movie.title}</Title>
        <Text className="movie__date">{date}</Text>
        <Tag className="movie__tag">Drama</Tag>
        <Paragraph className="movie__overview">{cutOverview(movie.overview, overviewHeight, overviewWidth)}</Paragraph>
      </Card>
    )
  }
}
