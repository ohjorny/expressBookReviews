const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. You can login now." });
    }
    else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
  res.status(404).json({ message: "Unable to register user. Either username or password not provided." })
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  // res.send(JSON.stringify(books, null, 4));
  try {
    const bookData = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 300);
    });
    res.send(JSON.stringify(bookData, null, 4));
  } catch (err) {
    console.error("Error retrieving books: ", err.message);
    res.status(500).json({ message: "Internal error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const givenISBN = req.params.isbn;
  try {
    const isbnData = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundISBN = books[givenISBN];
        if (foundISBN) {
          resolve(foundISBN);
        }
        else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
    if (isbnData) {
      res.send(JSON.stringify(isbnData, null, 4));
    }
    else {
      res.status(404).json({ message: `Book not found with ISBN ${givenISBN}` });
    }
  } catch (err) {
    console.error("Issue retrieving book: ", err.message);
    res.status(500).json({ message: "Internal error retrieving book" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const givenAuthor = req.params.author;
  try {
    const authorData = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const listOfItems = Object.values(books);
        const matchingBooks = listOfItems.filter((item) => item.author === givenAuthor);
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        }
        else {
          reject(new Error(`No book found with author ${givenAuthor}`));
        }
      }, 1000);
    });
    if (authorData) {
      res.send(JSON.stringify(authorData, null, 4));
    }
    else {
      res.status(404).json({ message: `Book not found with ISBN ${givenAuthor}` });
    }
  } catch (err) {
    console.error("Issue retrieving book: ", err.message);
    res.status(500).json({ message: "Internal error retrieving book" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const givenTitle = req.params.title;
  const listOfTitles = Object.values(books);
  const matchingTitles = listOfTitles.filter((item) => item.title === givenTitle);
  if (matchingTitles.length > 0) {
    res.send(JSON.stringify(matchingTitles, null, 4));
  }
  else {
    res.send(`No books found with title ${givenTitle}`);
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const givenISBN = req.params.isbn;
  const foundISBN = books[givenISBN];
  res.send(JSON.stringify(foundISBN.reviews, null, 4));
});

module.exports.general = public_users;
