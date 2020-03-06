const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');


const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		},
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	const hash = '$2b$10$YripV.m.oz5aG5Z/uU/f0uyHbNPfkChnweL9ByT2.CEu4oIGF2qvy';
	bcrypt.compare("apples", hash, (err, res) => {
		console.log('first guess', res)
	});
	bcrypt.compare("veggies", hash, (err, res) => {
		console.log('second guess', res)
	});
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, password, name } = req.body;
	bcrypt.hash(password, saltRounds, (err, hash) => {
		console.log(hash);
	});
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(404).json('not found');
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(404).json('not found');
	}
})

app.listen(1234, () => {
	console.log("app is running on port 1234");
})