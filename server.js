const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const imageurl = require('./controllers/image');

const database = knex({
	client: 'pg',
	connection: {
		host: 'postgresql-adjacent-32062',
		user: 'postgres',
		password: 'postgres',
		database: 'facerecognition'
	}
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.json('it is working') })

app.post('/signin', signin.handleSignin(database, bcrypt, saltRounds))
app.post('/register', register.handleRegister(database, bcrypt, saltRounds))
app.get('/profile/:id', profile.handleProfileGet(database))
app.put('/image', image.handleImage(database))
app.post('/imageurl', image.handleApiCall())

app.listen(process.env.PORT || 3000, () => { 
	console.log(`app is running on port ${process.env.PORT}`);
})