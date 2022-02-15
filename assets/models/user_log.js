const {crypter,decrypter} = require('../functions/crypter') // Hash module
const model_user = require('./User') // Mongo Model Import
const jwt = require('jsonwebtoken')

class User_log{
	static async Signup(password,email){
		return new Promise(async (next)=>{
			let hashed_password = await crypter(password)
			const new_user = new model_user({
				email:email,
				password:hashed_password
			})
			new_user.save()
				.then((result)=>{next({message:'user registered'})})
				.catch(error => next(error))
		})
	}
	static async Login(password,email){
		return new Promise(async (next)=>{
			model_user.findOne({email : email})
			.then(async (user) =>{
				if(!user)
					next({error: 'No such mail found',status:400})
				else{
					let check_mdp = await decrypter(password,user.password)
					if(!check_mdp){
						next({error:'wrong password',status:400})
					}
					else{
						next({
							userId:user._id,
							token:jwt.sign(
								{userId: user._id},
								'RANDOM_TOKEN_SECRET',
								{expiresIn:'24h'}
							),
							status:200
						})
					}
				}
			})
		})
	}
}

module.exports = User_log