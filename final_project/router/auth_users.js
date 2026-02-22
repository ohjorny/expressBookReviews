const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(404).json({ message: "No username or password provided" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: password },
      "access", { expiresIn: 60 * 60 }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in!" });
  }
  else {
    return res.status(208).json({ message: "Invalid login. Check username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const givenISBN = req.params.isbn;
  const foundISBN = books[givenISBN];
  const username = req.session.authorization.username;
  if (!username) {
    res.status(403).json({ message: "Unidentified user. Please login" });
  }
  if (foundISBN) {
    const review = req.body.review;
    if (review) {
      if (foundISBN.reviews.length === 0) {
        foundISBN["reviews"] = { "user": username || "Anonymous", "review": review };
        res.status(200).json({ message: `Added your review to book with the ISBN ${givenISBN}.` })
      }
      else {
        foundISBN.reviews[username] = review;
        res.status(200).json({ message: `Updated your previous review for book with the ISBN ${givenISBN}.` })
      }
    }
  }
  else {
    res.status(404).json({ message: `Unable to find book with ISBN ${givenISBN}` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const givenISBN = req.params.isbn;
  if (givenISBN) {
    const foundISBN = books[givenISBN];
    const reviews = foundISBN.reviews;
    const username = req.session.authorization.username;
    if (reviews[username]) {
      delete reviews[username];
      return res.send(`Your review for book with ISBN ${givenISBN} has been deleted.`);
    }
    return res.send(`No reviews found for book with ISBN ${givenISBN}`);
  }
  return res.send(`No book found with ISBN ${givenISBN}`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
