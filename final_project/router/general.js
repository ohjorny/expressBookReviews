const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const givenISBN = req.params.isbn;
  const foundISBN = books[givenISBN];
  if (!foundISBN) {
    res.send("No book found");
  }
  res.send(foundISBN);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const givenAuthor = req.params.author;
  const listOfBookISBNs = Object.values(books);
  const matchingBooks = listOfBookISBNs.filter((item) => item.author === givenAuthor);
  if (matchingBooks.length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  }
  else {
    res.send(`No books found by ${givenAuthor}`);
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
