const model_sauces = require('../models/sauces')
const fs = require('fs');

exports.getSauces = (req,res) =>{
	model_sauces.find()
	.then(sauces => res.status(200).json(sauces))
	.catch(error => res.status(404).json({error}))
}

exports.addSauces = (req,res,next) =>{
	console.log(req.file)
	const Objsauce = JSON.parse(req.body.sauce); // Transforme la string sauce en Obj
	delete Objsauce._id; // Supprime une clés id en trop

	const new_sauce = new model_sauces({
		...Objsauce,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes:0,
		dislikes:0
	})
	new_sauce.save()
	.then(() => res.status(201).json({message: 'Sauce enregistrée'}))
	.catch((error) => console.log(error))
}

exports.getSaucesById = (req,res) =>{
	model_sauces.findOne({_id:req.params.id})
	.then(sauce => res.status(200).json(sauce))
	.catch(error => res.status(404).json({error}))
}

exports.modifySauces = (req,res) =>{
	const SauceObject = req.file ? // Si il y'a un fichier
	{ // Alors on reçoit un Objet js à convertir en JSON
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	}
	: {...req.body} // sinon sans fichier on reçoit un recap String
	
	const promise_modify = () =>{
		return model_sauces.updateOne({ _id : req.params.id}, {...SauceObject,_id: req.params.id})
		.then( () => res.status(200).json({message : 'Sauce modifiée'}))
		.catch(error => res.status(404).json({error}))
	}

	const promise_DelPhoto = (req,res,next) =>{
		model_sauces.findOne({ _id: req.params.id })
		.then( sauce => {
			const filename = sauce.imageUrl.split('/images/')[1]
			console.log('supressing')
			fs.unlink(`images/${filename}`, () =>{
				next;
			})
		})
	}

	req.file ?
	promise_DelPhoto(req,res,promise_modify())
	: promise_modify()
}

exports.deleteSauces = (req,res) =>{
	model_sauces.findOne({ _id: req.params.id })
	.then( sauce => {
		if(!sauce){
			res.status(404).json({error:new Error('Sauce not found')})
		}
		if(sauce.userId !== req.auth.userId){
			res.status(403).json({
				error: new Error('Unauthorized request')
			})
		} else{
			const filename = sauce.imageUrl.split('/images/')[1]
			fs.unlink(`images/${filename}`, () =>{
				model_sauces.deleteOne({ _id : req.params.id }) // Sauce Deletion
				.then( () => res.status(200).json({message: 'Sauce supprimée'}))
				.catch(error => res.status(404).json({error}))
			})
		}
	})
	.catch((error) => {
		res.status(400).json({error:error})
	})
}


exports.likeSauces = async (req,res) =>{
	try{
		let userId = req.body.userId
		let likes = await likearr(req), dislikes = await dislikearr(req)
		let likecontainsUser = likes.includes(userId),dislikecontainsUser = dislikes.includes(userId)

		switch(parseInt(req.body.like)){ // Valeur de like
			case 1: // J'aime
				if(!likecontainsUser){
					model_sauces.updateOne({ _id : req.params.id}, {$inc : {likes:1}, $push: {usersLiked: req.body.userId}})
					.then( () => res.status(200).json({message : 'Like ajouté'}))
					.catch(error => res.status(404).json({error}))
				} else {
					res.status(200).json({message:'L\'utilisateur like déjà cette sauce'})
				}
				break;

			case -1: // Je n'aime pas
				if(!dislikecontainsUser){
					model_sauces.updateOne({ _id : req.params.id}, {$inc : {dislikes:1}, $push: {usersDisliked: req.body.userId}})
					.then( () => res.status(200).json({message : 'Dislike ajouté'}))
					.catch(error => res.status(404).json({error}))
				} else{
					res.status(200).json({message:'L\'utilisateur dislike déjà cette sauce'})
				}
				break;

			case 0: // J'enlève
				if(likecontainsUser){
					model_sauces.updateOne({ _id : req.params.id}, {$inc : {likes:-1}, $pull: {usersLiked: req.body.userId}})
					.then( () => res.status(200).json({message : 'Like enlevé'}))
					.catch(error => res.status(404).json({error}))
				}

				else if(dislikecontainsUser){
					model_sauces.updateOne({ _id : req.paramd.id}, {$inc : {dislikes:-1}, $pull: {usersDisliked: req.body.userId}})
					.then( () => res.status(200).json({message : 'Dislike enlevé'}))
					.catch( error => res.status(404).json({error}))
				}
				else{
					res.status(400).json({error: 'No like nor dislike'})
				}
				break;

			default:
				res.status(400).json({message:'Wrong like value'})
				break;
		}
	} 
	catch(e){
		res.json(e)
	}
}

async function likearr(req){
	return model_sauces.findOne({ _id : req.params.id })
	.then( sauce => {return sauce.usersLiked})
	.catch(error => {return error})
}

async function dislikearr(req){return model_sauces.findOne({ _id : req.params.id })
	.then( sauce => {return sauce.usersDisliked})
	.catch(error => {return error})
}

function removeFromArray(arr,removeVal){
	for( let i = 0; i < arr.length; i++){ 
	   if ( arr[i] === removeVal) {
	     arr.splice(i, 1); 
	   }
	}
}