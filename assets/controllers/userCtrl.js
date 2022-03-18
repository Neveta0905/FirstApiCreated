const model_user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();

exports.signup = (req,res) =>{
	bcrypt.hash(req.body.password,10)
	.then(hash => {
		const new_user = new model_user({
			email:req.body.email,
			password:hash
		})
		new_user.save()
			.then(()=>{res.status(201).json(({message:'user registered'}))})
			.catch(error => res.status(400).json({error:error}))
	})
	.catch((error) => res.status(500).json(error))
}

exports.login = (req,res) =>{
	model_user.findOne({email: req.body.email})
	.then(user => {
		if(!user){
			return res.status(401).json({error:'Wrong Id'})
		}
		bcrypt.compare(req.body.password,user.password)
		.then(valid =>{
			if(!valid){
				return res.status(401).json({error:valid})
			}
			res.status(200).json({
				userId:user._id,
				token: jwt.sign( // User Id gardé cypté en front
					{ userId: user._id},
					process.env.TokenCrypter,
					{ expiresIn:'24h'}
				)
			})
		})
		.catch(error => res.status(500).json(error))
	})
	.catch(error => res.status(500).json(error))
}