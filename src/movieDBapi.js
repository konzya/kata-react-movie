export default class MovieDBapi {
  static headers = new Headers({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWY1NzY4MTg5ZjgxOTVkYWFmMjcyNmQzMmRiYWY4MiIsInN1YiI6IjYyZjJkODQxNWIyZjQ3MDA3ZmZhZjk1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0qQ9P8HniH8wb5DER0ImFcmlVj4Q3k-Ae_I0ZGtWWFE',
  })

  static apiKey = 'faf5768189f8195daaf2726d32dbaf82'

  static guestSessionId

  static async guestSessionInit() {
    this.guestSessionId = localStorage.getItem('guestSessionId')

    if (!this.guestSessionId) {
      const response = await this.createGuestSession()
      this.guestSessionId = response.guest_session_id
      localStorage.setItem('guestSessionId', response.guest_session_id)
    }
  }

  static async createGuestSession() {
    const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
      headers: this.headers,
    })
    const body = await response.json()
    return body
  }

  static async getMovies(str, page) {
    if (!str) return { results: null }
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?language=en-US&query=${encodeURI(str)}&page=${page}`,
      {
        headers: this.headers,
      }
    )
    const body = await response.json()
    if (body.results.length === 0) throw new Error('No such movies')
    return body
  }

  static async getRatedMovies(page) {
    if (!this.guestSessionId) throw new Error('no guest session')
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${encodeURI(this.guestSessionId)}/rated/movies?api_key=${
        this.apiKey
      }&page=${page}}`
    )
    const body = await response.json()
    return body
  }

  static async getPoster(str) {
    if (!str) throw new Error()
    const response = await fetch(`https://image.tmdb.org/t/p/w500${str}`)
    const file = await response.blob()
    const url = URL.createObjectURL(file)
    return url
  }

  static async rateMovie(id, rating) {
    const requestBody = {
      value: rating,
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${encodeURI(
        this.guestSessionId
      )}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    )
    const body = await response.json()
    if (body.success !== true) throw new Error('failed to rate')
    return body
  }

  static async getGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`)
    const body = await response.json()
    const genres = {}

    body.genres.forEach((genre) => {
      genres[genre.id] = genre.name
    })

    return genres
  }
}
