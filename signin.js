const handleSignin = (req,res,db,bcrypt)=>{
	const {email,password} = req.body;
	if(!email||!password){
		return res.status(400).json('incorrect form submission');
	}

	db.select('email','hash').from('login') 
	//get email and hash from login through the email of the request
	.where('email','=',email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		//compare the passwords
		if(isValid){
			return db.select('*').from('users') 
			.where('email', '=', email) //get the user from users
			.then(user=>{
				res.json(user[0]) //return the user
			})
			.catch(err => res.status(400).json('unable to get user'))
		}else{
			res.status(400).json('wrong credentials')
		}
		
	})
	.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}