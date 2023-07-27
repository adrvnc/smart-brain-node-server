//requires express package
const express = require('express');
const bodyParser = require('body-parser'); //require this in every project you do with Express JS
const bcrypt = require('bcrypt-nodejs'); // encrypts user passwords using generated hashes. Only the server can read what you send it, and only you can read what the server sends back.
const cors = require('cors'); //require this in every node/express project
const knex = require('knex'); //connect database and server 
require('dotenv').config(); //environmental variables

//import routes from corresponding files
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//knex configuration
const db = knex({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  });

  // uses knex to build an sql query statement for postgres
  // has all the information used access the smart brain server
db.select('*').from('users').then(data => {
    console.log(data);
});

// creats app by running express package
const app = express();

app.use(bodyParser.json());
app.use(cors())

// route
app.get('/', (req, res)=> {
    res.send('success');
})

// signIn route 
//passes signIn route, from the signin.js file, with the necessary dependencies it needs
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

//register route 
//passes register route, from the register.js file, with the necessary dependencies it needs
app.post('/register', (req, res) =>  { register.handleRegister(req, res, db, bcrypt) })

//profile route 
//passes profile route, from the profile.js file, with the necessary dependencies it needs
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

//image route
//passes image route, from the image.js file, with the necessary dependencies it needs
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// new endpoint within the image.js file to process Clarifai API image requests and send back a response. 
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// if we receieve a port from heroku, or any other cloud platform, run that first.
// Otherwise, run port 3001 
app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running successfully on ${process.env.PORT}`);
});

 // Endpoints (If you were a backend dev working with fronend dev's, I would recommend letting them know what endpoints to expect beforehand)
 /* 
 
 /(route) GET res(resonse) that will say "this is working"
 /signIn Route - POST request that will respond with success or fail
 /register route - POST request that returns (user) object. Creates a new user
 /profile/:userID --> GET request that reutrns information of the user 
 /image - PUT request that returns user ranking based on how many photos they've submitted. 
 The variable increases by 1 everytime a user submits a photo and ranks them among other users to see who's 
 posted the most photos

 */ 



