const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'El titulo de pelicula debe ser de tipo String',
    required_error: 'El titulo de la pelicula es obligatorio'
  }),
  year: z.number().int().min(1900).max(2025),
  img: z.string().url(),
  director: z.string(),
  duration: z.number().positive().int(),
  genre: z.array(z.enum(['action', 'anime', 'crime', 'drama', 'fantasy']))
})

function validateMovie(object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}