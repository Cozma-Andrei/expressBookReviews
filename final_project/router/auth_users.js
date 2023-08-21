const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let filtered = users.filter((user) => {
    return user.username === username;
  });
  if (filtered.length > 0)
    return true;
  return false;
}

const authenticatedUser = (username, password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!authenticatedUser(username, password))
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: `User ${username} successfully logged in.`});
  }
  return res.status(404).json({message: "Error logging in"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  let ok = 0;
  for (const key in books[isbn].reviews) {
    if (key === username) {
      books[isbn].reviews[key].review = review;
      ok = 1;
      break;
    }
  }
  if (!ok)
    books[isbn].reviews[username] = {"review": review};
  res.status(200).json(books[isbn].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  for (const key in books[isbn].reviews) {
    if (key === username) {
      delete books[isbn].reviews[key];
    }
  }
  res.status(200).json(books[isbn].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
