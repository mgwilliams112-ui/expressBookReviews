const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nameExists = (usesrname) => {
        sameName = users.filter((user)=> user.username == username);
        if(sameName.length > 0) {
            return true
        } else {
            return false
        }
    }; 
    if (username && password) {
        if (!nameExists(username)) {
            users.push({'username' : username, 'password': password});
            res.status(200).json({message: 'The user was succesfully registered.'})
            
        } else {
            res.status(404).json({message: 'This username is unavailable.'})
        }
    } else {
        res.status(404).json({message: 'Username and/or password missing.'})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN])
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuth = Object.values(books).filter(book => book['author'] === author);
    res.send(booksByAuth)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = Object.values(books).filter((book) => book['title'] == title);
    res.send(booksByTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
