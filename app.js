require('babel-register')
const express = require('express')
const morgan = require('morgan')('dev')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose')

// Dotenv to config port
const dotenv = require("dotenv");
dotenv.config();
const MY_PORT = process.env.PORT;
const MY_APP_SECRET = process.env.APP_SECRET;

// Connect to Mongo
const app = express()
mongoose.connect('mongodb+srv://Neveta:12345@cluster0.7sr4f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//User model
const user = require('./assets/models/user_log')


// Use middleware
app.use(morgan)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// Create User Router
let UserRouter = express.Router()

	// Sign In
	UserRouter.route('/signup')
		.post(async (req,res) =>{
			let new_user = await user.Signup(req.body.password,req.body.email)
			res.json(new_user)
		})

	// Log In
	UserRouter.route('/login')
		.post(async (req,res)=>{
			user.Login(req.body.password,req.body.email)
			.then((result)=>{
				res.status(result.status).json(result)
			})
		})

// Definie User route
app.use('/api/auth/',UserRouter)

// Create sauces routes
let SaucesRouter = express.Router()

	// General
	SaucesRouter.route('')
		.get(async(req,res)=>{
			res.json({message:'je veux ttes les sauces'})
		})

		.post(async(req,res)=>{
			res.json({message:'je rajoute une sauce et sa photo'})
		})

	// Id Targeted
	SaucesRouter.route('/:id')
		.get(async(req,res)=>{
			res.json({message:'je veux la sauce ' + req.params.id})
		})

		.put(async(req,res)=>{
			res.json({message:'je modifie la sauce ' + req.params.id})
		})

		.delete(async(req,res)=>{
			res.json({message:'je supprimme la sauce ' + req.params.id})
		})


		SaucesRouter.route('/:id/like')
			.post(async(req,res)=>{
				res.json({message:'je kiffe la sauce ' + req.params.id})
			})

// Definie la route utilisée par SaucesRouter
app.use('/api/sauces/',SaucesRouter)



// Launch app on port
app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`));
