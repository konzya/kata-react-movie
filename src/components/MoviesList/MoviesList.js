import React from 'react'
import { Col, Row } from 'antd/lib/grid'

import Movie from '../Movie/Movie'
import './MoviesList.css'

export default function MoviesList(props) {
  const { movies } = props

  let items = []
  if (movies) {
    items = movies.map((movie) => (
      <Col className="movies-list__item" xs={24} sm={24} md={24} lg={12} key={movie.id}>
        <Movie movie={movie} />
      </Col>
    ))
  }

  return (
    <section className="movies-list">
      <Row gutter={[32, 32]}>{items}</Row>
    </section>
  )
}
