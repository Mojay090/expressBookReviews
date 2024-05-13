const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  for (const user of users) {
    if (user.username === username) {
      return false;
    }
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const secretKey = "fingerprint_customer";
  const token = jwt.sign(
    {
      username,
      password,
    },
    secretKey,
    {
      expiresIn: 60 * 60,
    }
  );
  const jwtPayload = jwt.verify(token, secretKey);
  for (const credentials of users) {
    if (
      jwtPayload.username === credentials.username &&
      jwtPayload.password === credentials.password
    ) {
      return { authenticated: true, token };
    }
  }
  return { authenticated: false, token: "" };
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { authenticated, token } = authenticatedUser(
    req.body.username,
    req.body.password
  );
  if (authenticated) {
    req.session.authorization = {
      token,
    };
    return res.status(200).json({
      message: "Successfully logged in.",
    });
  } else {
    return res.status(400).json({
      message: "Username or password is invalid",
    });
  }
});

// Add a book review
regd_users
  .put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    books[req.params.isbn].reviews[username] = req.body.review;
    return res
      .status(200)
      .json({
        message: `${username} posted a review for book with isbn ${req.params.isbn}`,
      });
  })
  .delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    if (books[req.params.isbn].reviews[username]) {
      delete books[req.params.isbn].reviews[username];
      return res
        .status(200)
        .json({
          message: `${username} deleted their review for book with isbn ${req.params.isbn}`,
        });
    } else {
      return res
        .status(400)
        .json({
          message: `Error deleting ${username}'s review for ISBN ${req.params.isbn}`,
        });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
