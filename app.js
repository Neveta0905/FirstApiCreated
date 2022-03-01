const express = require('express')
const morgan = require('morgan')('dev')
/*const bodyPaser = require('body-parser')*/
const mongoose = require('mongoose')

// Dotenv to config port
const dotenv = require("dotenv");
dotenv.config();
// Connect to Mongo
const app = express()
mongoose.connect(process.env.MONGO,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Use middleware
app.use(morgan)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Import User Router
const userRouter = require('./assets/routes/user')
app.use('/api/auth',userRouter)

// Import SaucesRouter
const saucesRouter = require('./assets/routes/sauces')
app.use('/api/sauces', saucesRouter )

// Export app to server
module.exports = app