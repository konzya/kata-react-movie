import React from 'react'
import { Card, Typography, Tag } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import cutOverview from '../../cutOverview'
import './Movie.css'

const { Title, Paragraph, Text } = Typography

export default class Movie extends React.Component {
  state = {
    overviewHeight: 0,
    overviewWidth: 0,
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
    this.resizeObserver.observe(this.card.current)
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect()
  }

  render() {
    const { movie } = this.props
    const { overviewHeight, overviewWidth } = this.state
    const url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    const cover = <img src={url} alt={movie.original_title} />
    const date = parseISO(movie.release_date)
    return (
      <Card className="movie" cover={cover} bordered={false} ref={this.card}>
        <Title className="movie__title">{movie.original_title}</Title>
        <Text className="movie__date">{format(date, 'MMMM d, y')}</Text>
        <Tag className="movie__tag">Drama</Tag>
        <Paragraph className="movie__overview">{cutOverview(movie.overview, overviewHeight, overviewWidth)}</Paragraph>
      </Card>
    )
  }
}
