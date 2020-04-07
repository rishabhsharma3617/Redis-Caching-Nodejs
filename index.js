const express = require('express')
const redis = require('redis')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT)
const app = express()


//cache middleware
function cache (req,res,next) {
    const {username } = req.params
    client.get(username , (err ,data) => {
        if(err)
        {
            throw err;
        }
        if(data !== null)
        {
            res.send(`<h1>${username} has ${data} repos</h1>`)
        }
        else
        {
            next()
        }
    })    
}


app.get('/repos/:username' ,cache ,  async (req,res,next) => {
    try {
        console.log("Fetching the data from the api")
        const { username }  = req.params
        const response = await fetch(`https://api.github.com/users/${username}`)
        const data = await response.json()
        const repos = data.public_repos

        //Set the data to the redis
        client.setex(username , 3600 , repos)

        res.send(`<h1>${username} has ${repos} repos</h1>`)
    } catch (error) {
        console.log(error)
    }
})



app.listen(PORT , () => console.log(`App is listening to ${PORT}`))