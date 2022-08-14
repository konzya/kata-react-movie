export default class MovieDBapi {
  static headers = new Headers({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWY1NzY4MTg5ZjgxOTVkYWFmMjcyNmQzMmRiYWY4MiIsInN1YiI6IjYyZjJkODQxNWIyZjQ3MDA3ZmZhZjk1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0qQ9P8HniH8wb5DER0ImFcmlVj4Q3k-Ae_I0ZGtWWFE',
  })

  static async getMovies(str) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?language=en-US&query=${encodeURI(str)}`, {
      headers: this.headers,
    })
    const body = await response.json()
    return body
  }
}
