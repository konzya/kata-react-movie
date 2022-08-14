import React from 'react'
import { Col, Row } from 'antd/lib/grid'

import Movie from '../Movie/Movie'
import './MoviesList.css'

export default function MoviesList(props) {
  const { movies } = props
  let items = null
  if (movies) {
    items = movies.map((movie) => (
      <Col className="movies-list__item" xs={24} sm={24} md={12} key={movie.id}>
        <Movie movie={movie} />
      </Col>
    ))
  }
  return (
    <Row className="movies-list" gutter={[32, 32]}>
      {items}
    </Row>
  )
}
