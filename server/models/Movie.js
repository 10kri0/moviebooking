const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a movie name'],
      trim: true
    },
    length: {
      type: Number,
      required: [true, 'Please add a movie length']
    },
    img: {
      type: String,
      required: [true, 'Please add a movie img'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10']
    },
    genre: {
      type: String,
      required: [true, 'Please add a genre'],
      enum: [
        'Action',
        'Comedy',
        'Drama',
        'Horror',
        'Sci-Fi',
        'Thriller',
        'Romance',
        'Fantasy',
        'Animation',
        'Documentary'
      ],
      default: 'Drama'
    }
  },
  { timestamps: true }
)

movieSchema.pre('deleteOne', { document: true, query: true }, async function (next) {
  const movieId = this._id
  const showtimes = await this.model('Showtime').find({ movie: movieId })

  for (const showtime of showtimes) {
    await showtime.deleteOne()
  }
  next()
})

module.exports = mongoose.model('Movie', movieSchema)