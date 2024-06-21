const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const dbpath = path.join(__dirname, 'moviesData.db')
let db = null
const app = express()
app.use(express.json())

const moviesArray = movies => {
  return {
    movie_id: movies.movie_id,
    director_id: movies.director_id,
    movie_name: movies.movie_name,
    lead_actor: movies.lead_actor,
  }
}
const connectDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('port is running on 3000')
    })
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
connectDbAndServer()
app.get('/movies/', async (request, response) => {
  const listMovies = `SELECT * FROM movie`
  const arrMovie = await db.all(listMovies)
  response.send(map(arrMovie.map(eachItem => moviesArray(eachItem))))
})

app.post('/movies/', async (request, response) => {
  const movieDetais = request.body
  const {director_id, movie_name, lead_actor} = movieDetais
  const addMovie = `
    INSERT INTO movie(director_id, movie_name, lead_actor)
    VALUES(
        ${drirector_id},
        '${movie_name}',
        '${lead_actor}'
    )`
  const dbResponse = await db.run(addMovie)
  response.send('Movie Succesfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const resultMovie = `SELECT * FROM movie WHERE movie_id = ${movie_id}`
  const result = db.get(resultMovie)
  response.send(moviesArray(result))
})

app.put('movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {movie_id, director_id, movie_name, lead_actor} = movieDetails
  const updatedMovie = `
    UPDATE movie SET 
        director_id: ${director_id},
        movie_name: ${movie_name},
        lead_actor: ${lead_actor}
    `
  const result = await db.run(updatedMovie)
  response.send('Movie Details Updated')
})

app.delete('movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteQue = `
    DELETE FROM movie WHERE movie_id = ${movieId}`
  const dealingQue = await db.run(deleteQue)
  response.send('Movie Removed')
})
app.get('/directors/', async (request, response) => {
  const directorQue = `
    SELECT * FROM director`
  const listMovies = await db.all(directorQue)
  response.send(listMovies.map(eachItem => moviesArray(eachItem)))
})
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.director_id
  const getMovies = `
    SELECT * FROM movie WHERE director_id =${director_id}
    `
  const arrMovie = await db.all(getMovies)
  response.send(arrMovie.map(eachItem => moviesArray(eachItem)))
})
module.exports = app