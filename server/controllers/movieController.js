
const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime')


//@desc     GET showing movies with all unreleased showtime
//@route    GET /movie/unreleased/showing
//@access   Private admin
exports.getUnreleasedShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1, updatedAt: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET all movies
//@route    GET /movie
//@access   Public
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: movies.length, data: movies })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

//@desc     GET showing movies
//@route    GET /movie/showing
//@access   Public
exports.getShowingMovies = async (req, res, next) => {
  try {
    const showingShowtime = await Showtime.aggregate([
      { $match: { showtime: { $gte: new Date() }, isRelease: true } },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movie'
        }
      },
      {
        $group: {
          _id: '$movie',
          count: { $sum: 1 }
        }
      },
      {
        $unwind: '$_id'
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$_id']
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    res.status(200).json({ success: true, data: showingShowtime })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

//@desc     GET single movie
//@route    GET /movie/:id
//@access   Public
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: `Movie not found with id of ${req.params.id}` 
      })
    }

    res.status(200).json({ success: true, data: movie })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

//@desc     Create movie
//@route    POST /movie
//@access   Private
exports.createMovie = async (req, res, next) => {
  try {
    // Convert hours and minutes to total minutes if needed
    if (req.body.lengthHr || req.body.lengthMin) {
      req.body.length = (parseInt(req.body.lengthHr) || 0) * 60 + 
                       (parseInt(req.body.lengthMin) || 0)
    }

    const movie = await Movie.create(req.body)
    res.status(201).json({
      success: true,
      data: movie
    })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

//@desc     Update movie
//@route    PUT /movie/:id
//@access   Private Admin
exports.updateMovie = async (req, res, next) => {
  try {
    // Convert hours and minutes to total minutes if needed
    if (req.body.lengthHr || req.body.lengthMin) {
      req.body.length = (parseInt(req.body.lengthHr) || 0) * 60 + 
                       (parseInt(req.body.lengthMin) || 0)
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: `Movie not found with id of ${req.params.id}` 
      })
    }
    res.status(200).json({ success: true, data: movie })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

//@desc     Delete single movie
//@route    DELETE /movie/:id
//@access   Private Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: `Movie not found with id of ${req.params.id}` 
      })
    }

    await movie.deleteOne()
    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}