const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username))
      return res.status(404).json({ message: "User already exists!" });
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: `User ${username} successfully registered.` });
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});

public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  const authorBooks = {};
  for (const key in books) {
    if (books[key].author === author)
      authorBooks[key] = books[key];
  }
  res.send(JSON.stringify(authorBooks, null, 4));
});

public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  const book = {};
  for (const key in books) {
    if (books[key].title === title)
      book[key] = books[key];
  }
  res.send(JSON.stringify(book, null, 4));
});

public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
