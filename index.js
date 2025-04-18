const express = require("express");
const crypto = require("crypto")
const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");

const app = express();
app.use(express.json())
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("¡Bienvenidos a mi página de películas!");
});

// Todos los recursos que sean MOVIES se identifica con /movies
app.get("/movies", (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === parseInt(id));
  if (movie) return res.json(movie);
  res.status(404).json({ message: "Pelicula no encontrada" });
});

app.post('/movies', (req, res) => {
	const result = validateMovie(req.body)
	if(result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message)})
	}
	
	const newMovie = {
		id: crypto.randomUUID(),
		... result.data
	}
	movies.push(newMovie)
	res.status(201).json(newMovie)
	res.send("Pelicula creada satisfactoriamente!")
})

app.patch('/movies/:id', (req, res)=>{
	const result = validatePartialMovie(req.body)
	if(!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message)})
	}
	const {id} = req.params
	const movieIndex = movies.findIndex(movie => movie.id === Number(id))
	if(movieIndex === -1) {
		return res.status(404).json({message: "Pelicula no encontrada"})
	}
	const updateMovie = {
		...movies[movieIndex],
		...result.data
	}
	movies[movieIndex] = updateMovie
	return res.json(updateMovie)	
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`);
});
