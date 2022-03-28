const express = require('express')
const { database } = require('pg/lib/defaults')

const db = require('../utils/database')

const petsRouter = express.Router()

//GET /pets - getting all pets from the database
petsRouter.get('/', (req, res) => {
    const selectAllPetsQuery = "SELECT * FROM pets"

    //query method to send a SQL query to the database. Asynchronous, this will run later. .then is a callback function.
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

//GET /pets/:id - loads a single pet by id
petsRouter.get('/:id', (req, res) => {
    //$1 is a placeholder as we don't want to add it to the query directly. 
    const selectSinglePetQuery = "SELECT * FROM pets WHERE id = $1"

    //This replaces the placeholder
    const queryValues = [
        req.params.id //$1 = pet id
    ]

    db.query(selectSinglePetQuery, queryValues)
        .then(function(databaseResult) {  //Asynchronous, this will run later. .then is a callback function.
            //If pet was not found, return a 404
            if(databaseResult.rowCount===0) {
                res.status(404)
                res.json({error: 'pet does not exist'})
            } else {
                //If pet found, return it
                res.json({pet: databaseResult.rows[0]})
            }
        })
        .catch(error => { //Asynchronous, this will run later. .catch is a callback function.
            res.status(500)
            res.json({error: 'unexpected Error'})
            console.log(error)
        })
})

//POST /pets - Adds a new pet
petsRouter.post('/', (req, res) => {
    //INSERT will add a new pet to the database, INTO where you want to add it, in this case pets.
    //THe values are inserted from the request body, we're using the '$1' as a placeholder once again
    /*RETURNING * - Returns the newly added pet as a query response to allow us 
    to be able to send the new added pet back to the client in the API response
    */
    const insertPetQuery = `
    INSERT INTO pets(
        name,
        age,
        type,
        breed,
        microchip)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *`

    const petsValue = [  //The values we want to use in place of the $ placeholders above for the insert query
        req.body.name, //$1 = name
        req.body.age, //$2 = age
        req.body.type, //$3 = type
        req.body.breed, //$4 = breed
        req.body.microchip //$5 = microchip
    ]

    db.query(insertPetQuery, petsValue) //Run the query, the second argument replaces the placeholders
        .then(databaseResult => {
            console.log(databaseResult)
            res.json({pet: databaseResult.rows[0]})
        })
        .catch(error => {
            console.log(error)
            res.status(500)
            res.json({error:'unexpected error'})
        })
})

module.exports = petsRouter