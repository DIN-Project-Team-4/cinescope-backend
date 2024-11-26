const {queryDb} = require("../repository/queryDatabase.js")

// Function to add a new review to database
const addReview = async (movieId, description, rating, reviewedAt, userId) => {
    const sql = 'insert into "Review"(movie_id,description,rating,reviewed_at,user_id) values ($1, $2, $3, $4, $5) returning *'
    let result
    try {
        result = await queryDb(sql, [movieId, description, rating, reviewedAt, userId])
        if (!result.rows.length) {
            throw new Error('Failed to insert review')
        }
    } catch (error) {
        throw new Error(`Error adding review: ${error.message}`);
    }
    return result.rows[0]
}

// Function to check if a given user has already reviewed a given movie
const alreadyReviewed = async (movieId, userId) => {
    const sql = 'select * from "Review" where movie_id = ($1) and user_id = ($2)'

    let result
    try {
        result = await queryDb(sql, [movieId, userId])
    } catch (error) {
        throw new Error(`Error checking if reviewed: ${error.message}`);
    }

    return result.rows.length > 0
}

// Function to get all reviews of a given movie
const getReviews = async (movieId) => {
    const sql = 'select * from "Review" where movie_id = ($1)'

    let result
    try {
        result = await queryDb(sql, [movieId])
    } catch (error) {
        throw new Error(`Error getting reviews: ${error.message}`);
    }
    return result.rows
}

module.exports = {addReview, alreadyReviewed, getReviews}
