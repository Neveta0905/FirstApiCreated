const model_sauces = require('../models/sauces')

exports.getSauces = (req,res) =>{
	res.json({message:'je veux ttes les sauces'})
}

exports.addSauces = (req,res) =>{
	res.json({message:'je rajoute une sauce et sa photo'})
}

exports.getSaucesById = (req,res) =>{
	res.json({message:'je veux la sauce ' + req.params.id})
}

exports.modifySauces = (req,res) =>{
	res.json({message:'je modifie la sauce ' + req.params.id})	
}

exports.deleteSauces = (req,res) =>{
	res.json({message:'je supprimme la sauce ' + req.params.id})
}


exports.likeSauces = (req,res) =>{
	res.json({message:'je kiffe la sauce ' + req.params.id})
}