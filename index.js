const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const color = require('colors')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB connected".green.bold);
})


const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())




app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','DELETE','PUT','PATCH'], // Allow specific HTTP methods
    credentials: true, // Allow cookies and authentication headers
}));


app.use('/', require('./routes/user'))
app.use('/admin', require('./routes/admin'))
app.use('/rider', require('./routes/rider'))


const PORT = 4000;
app.listen(PORT, () => {
    console.log("server connected".blue.bold);

})