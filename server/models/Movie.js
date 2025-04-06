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
		genre: {
			type: String,
			required: [true, 'Please add a genre']
		},
		rating: {
			type: Number,
			required: [true, 'Please add a rating']
		},
		language: {
			type: String,
			required: [true, 'Please add a language'],
			enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Other'],
			default: 'English'
		},
		showType: {
			type: String,
			required: [true, 'Please add a show type'],
			enum: ['2D', '3D', 'IMAX', '4DX'],
			default: '2D'
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