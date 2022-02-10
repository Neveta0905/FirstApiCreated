const bcrpyt = require('bcrypt')

const crypter = async (crypted) =>{
	return new Promise((next) =>{
		bcrpyt.hash(crypted,10)
			.then((hashed)=>{
				next(hashed)
			})
	})
}

module.exports = crypter;