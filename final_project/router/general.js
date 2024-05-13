const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const baseURL = "http://localhost:5544";

public_users.post("/register", (req, res) => {
  //Write your code here
  let errMessage = "";
  const userName = req.body.username;
  const userNameNotRegistered = isValid(userName);
  if (!userNameNotRegistered) {
    errMessage += `${userName} already registered.`;
  }
  const password = req.body.password;
  if (!password) {
    errMessage += `${password} not provided.`;
  }
  if (errMessage) {
    return res.status(200).json({ message: errMessage });
  } else {
    users.push(req.body);
    return res.status(200).json({ message: "Successfully registered!" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const allBooks = [];
  for (const key of Object.keys(books)) {
    const book = books[key];
    if (book["author"] === author) {
      allBooks.push(book);
    }
  }
  return res.status(200).json(allBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const allBooks = [];
  for (const key of Object.keys(books)) {
    const book = books[key];
    if (book["title"] === title) {
      allBooks.push(book);
    }
  }
  return res.status(200).json(allBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  return res.status(200).json(book["reviews"]);
});

const getAllBooks = async () => {
  const books = (await axios.get(`${baseURL}/`)).data;
  return books;
};

const getBookDetailsByISBN = async (isbn) => {
  const books = (await axios.get(`${baseURL}/isbn/${isbn}`)).data;
  return books;
};

const getBookDetailsByAuthor = async (author) => {
  const books = (await axios.get(`${baseURL}/author/${author}`)).data;
  return books;
};

const getBookDetailsByTitle = async function (title) {
  const books = (await axios.get(`${baseURL}/title/${title}`)).data;
  return books;
};

module.exports.general = public_users;
module.exports.asyncFunctions = {
  getAllBooks,
  getBookDetailsByAuthor,
  getBookDetailsByISBN,
  getBookDetailsByTitle,
};
