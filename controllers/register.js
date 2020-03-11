const handleRegister = (database, bcrypt, saltRounds) => (req, res) => {
	const { email, password, name } = req.body;
	const hash = bcrypt.hashSync(password, saltRounds);
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	database.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginemail => {
			return database('users')
				.returning('*')
				.insert({
					email: loginemail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => {
		res.status(400).json('unable to register');		
	})
};

module.exports = {
	handleRegister: handleRegister
};