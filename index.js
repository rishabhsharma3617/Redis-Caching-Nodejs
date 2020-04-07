const express = require('express')
const redis = require('redis')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT)
const app = express()

app.get('/repos/:username' , (req,res,next) => {
    try {
        const { username }  = req.params

        fetch(`https://api.github.com/users/${username}`).then((response) => {
            console.log(response)
            res.send(response.json())
        }).catch(err => console.log(err)) 

        console.log("Fetching the data from the api")
    } catch (error) {
        
    }
})



app.listen(PORT , () => console.log(`App is listening to ${PORT}`))