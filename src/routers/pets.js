const express = require('express')
const { database } = require('pg/lib/defaults')

const db = require('../utils/database')

const petsRouter = express.Router()

//GET /pets - getting all pets from the database
petsRouter.get('/', (req, res) => {
    const selectAllPetsQuery = "SELECT * FROM pets"

    //query method to send a SQL query to the database. Asynchronous, this will run later. .then is a callback.
    db.query(selectAllPetsQuery)
    .then(databaseResult => {
        //Log the result to the console
        console.log(databaseResult)
        //Send back the rows we got from the query
        res.json({ pets: databaseResult.rows })
    })
    .catch(error => {
        res.status(500)
        res.json({error: 'Unexpected Error'})
        console.log(error)
    })
})

// petsRouter.get('/')

module.exports = petsRouter