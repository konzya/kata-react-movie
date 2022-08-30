import React from 'react'
import { Col, Row } from 'antd/lib/grid'
import { Spin, Alert } from 'antd'

import Movie from '../Movie/Movie'
import './MoviesList.css'

export default function MoviesList(props) {
  const { movies, loading, error, offline, stars, setStars, getRatedMovies } = props

  let items = null
  if (movies) {
    items = movies.map((movie) => (
      <Col className="movies-list__item" xs={24} sm={24} md={24} lg={12} key={movie.id}>
        <Movie movie={movie} stars={stars[movie.id]} setStars={setStars} getRatedMovies={getRatedMovies} />
      </Col>
    ))
  }
  if (loading) {
    items = <Spin className="spinner" size="large" />
  }
  if (error) {
    items = <Alert message={error.message} type="error" showIcon />
  }
  if (offline) {
    items = <Alert message="No internet" type="error" showIcon />
  }
  return (
    <section className="movies-list">
      <Row gutter={[32, 32]}>{items}</Row>
    </section>
  )
}
