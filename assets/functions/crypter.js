const bcrpyt = require('bcrypt')

const crypter = async (tocrypt) =>{
	return new Promise((next) =>{
		bcrpyt.hash(tocrypt,10)
			.then((hashed)=>{
				next(hashed)
			})
	})
}

const decrypter = async(compared,crypted) => {
	return new Promise((next) =>{
		bcrpyt.compare(compared,crypted)
			.then((res)=>{
				if(res)
					next(true)
				else
					next(false)
			})
			.catch(error => error)
	})
}
module.exports = {crypter,decrypter};