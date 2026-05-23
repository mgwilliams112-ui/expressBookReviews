const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let existingUser = users.filter((user)=> user.username == username);
    if (existingUser.length > 0) {
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username,password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter((user) => user.username === username && user.password === password);
    if (validUser.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(404).json({message: 'Please double check that username and password are entered.'})
    } else {
        if (authenticatedUser(username, password)) {
           let accessToken = jwt.sign(
            {data: password},
            'access',
            {expiresIn: 60*30}
           );
           req.session.authorization = {accessToken, username};
           return res.status(200).json({message: "You have logged in succesfully!"})
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password." })
        }
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    let reviews = books[ISBN].reviews;
    const review = req.query.review;
    const username = req.session.authorization.username;
    reviews[username] = review;
    books[ISBN].reviews = reviews;
    res.send('Review added/updated.')
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.authorization.username;
    let reviews = books[ISBN].reviews;
    delete reviews[username];
    books[ISBN].reviews = reviews;
    res.send('Your review has been deleted.')
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
