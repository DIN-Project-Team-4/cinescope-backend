const {addReview, alreadyReviewed, getReviews} = require("../models/reviewModel.js")

// Function to create a new review
const createReview = async (req, res) => {
    const {movieId, description, rating, reviewedAt, userId} = req.body;

    if (!Number.isInteger(movieId)) {
        return res.status(400).json({error: 'Movie ID is invalid'})
    }

    if (rating === null) {
        return res.status(400).json({error: 'Movie rating cannot be null'})
    }

    if (userId === null) {
        return res.status(400).json({error: 'User ID cannot be null'})
    }

    // Check if the user has already reviewed the movie
    try {
        const alreadyReviewedMovie = await alreadyReviewed(movieId, userId);
        if (alreadyReviewedMovie) {
            return res.status(400).json({ error: 'User has already reviewed this movie' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error while checking existing reviews: ' + error.message });
    }

    // Add review to database
    try {
        const result = await addReview(movieId, description, rating, reviewedAt, userId)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(error.status || 500).json({error: error.message})
    }
}


//Function to get all the reviews by movie ID
const readReviews = async (req,res) => {

    if (!Number.isInteger(req.body.movieId)) {
        return res.status(400).json({error: 'Movie ID is invalid'})
    }

    //Get all the reviews
    try{
        const result = await  getReviews(req.body.movieId)
        return res.status(200).json(result)
    }catch(error){
        return res.status(error.status || 500).json({error: error.message})
    }
}

module.exports = {createReview, readReviews}
