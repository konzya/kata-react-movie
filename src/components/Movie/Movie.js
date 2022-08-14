import React from 'react'
import { Card, Typography, Tag } from 'antd'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import cutOverview from '../../cutOverview'
import './Movie.css'

const { Title, Paragraph, Text } = Typography

export default function Movie(props) {
  const { movie } = props
  const url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
  const cover = <img src={url} alt={movie.original_title} />
  const date = parseISO(movie.release_date)
  return (
    <Card className="movie" cover={cover} bordered={false}>
      <Title className="movie__title">{movie.original_title}</Title>
      <Text className="movie__date">{format(date, 'MMMM d, y')}</Text>
      <Tag className="movie__tag">Drama</Tag>
      <Paragraph className="movie__overview">{cutOverview(movie.overview)}</Paragraph>
    </Card>
  )
}
