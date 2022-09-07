import React from 'react'
import { Tag } from 'antd'

import './GenreList.css'

export default function GenreList(props) {
  const { genresList, movieGenres } = props
  const items = movieGenres.map((genreID) => (
    <Tag className="movie__tag" key={genreID}>
      {genresList[genreID]}
    </Tag>
  ))
  return <div className="movie__genres">{items}</div>
}
