//register route 
//enters new user into database 
//uses hashSync and a database transaction to connect existing user information from the user and login database
//use database transaction 'trx', instead of 'db' when you are trying to connect two things at once
const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body; //exports whatever the user enters as ther email, password, and name
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    } // if the name, email, or password are left blank, return a JSON response that says "incorrect form submission"
    const hash = bcrypt.hashSync(password); //encrypts password of registered users
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return db('users')
                .returning('*') //return all columns in the "users" table in our database
                .insert({
                    email: loginEmail[0].email,
                    name: name, 
                    joined: new Date()
            })
                .then(user => {
                res.json(user[0]); // grabs the data of the last person in the array (the last person who signed up)
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register')) //catch any errors 
}

// exports 'handleRegister' function 
module.exports = {
    handleRegister: handleRegister
}