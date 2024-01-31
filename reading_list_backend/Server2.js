// Import modules
const express = require('express');
const fs = require('fs');

// Create app
const app = express();

// Use JSON middleware
app.use(express.json());

// Define readingLists object
let readingLists = {};

// Load readingLists from file if exists
fs.readFile('readingLists.json', (err, data) => {
  if (err) {
    console.log('No file found, starting with empty readingLists');
  } else {
    readingLists = JSON.parse(data);
    console.log('Loaded readingLists from file');
  }
});

// Save readingLists to file every one minute
setInterval(() => {
  fs.writeFile('readingLists.json', JSON.stringify(readingLists), (err) => {
    if (err) {
      console.log('Error saving readingLists to file');
    } else {
      console.log('Saved readingLists to file');
    }
  });
}, 60000);

// Define routes

// Create a new reading list
app.post('/readingLists', (req, res) => {
  // Generate a random id
  let id = Math.floor(Math.random() * 1000000);
  // Create a new reading list object
  let readingList = {
    id: id,
    name: req.body.name,
    books: []
  };
  // Add the reading list to the readingLists object
  readingLists[id] = readingList;
  // Send back the created reading list
  res.status(201).json(readingList);
});

// Get all reading lists
app.get('/readingLists', (req, res) => {
  // Send back the readingLists object
  res.json(readingLists);
});

// Get a specific reading list by id
app.get('/readingLists/:id', (req, res) => {
  // Get the id from the params
  let id = req.params.id;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Send back the reading list
    res.json(readingList);
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Update a specific reading list by id
app.put('/readingLists/:id', (req, res) => {
  // Get the id from the params
  let id = req.params.id;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Update the reading list name
    readingList.name = req.body.name;
    // Send back the updated reading list
    res.json(readingList);
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Delete a specific reading list by id
app.delete('/readingLists/:id', (req, res) => {
  // Get the id from the params
  let id = req.params.id;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Delete the reading list from the readingLists object
    delete readingLists[id];
    // Send back a success message
    res.json({ message: 'Reading list deleted' });
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Create a new book in a reading list
app.post('/readingLists/:id/books', (req, res) => {
  // Get the id from the params
  let id = req.params.id;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Create a new book object
    let book = {
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      status: req.body.status
    };
    // Add the book to the reading list books array
    readingList.books.push(book);
    // Send back the created book
    res.status(201).json(book);
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Get all books in a reading list
app.get('/readingLists/:id/books', (req, res) => {
  // Get the id from the params
  let id = req.params.id;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Send back the reading list books array
    res.json(readingList.books);
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Get a specific book in a reading list by isbn
app.get('/readingLists/:id/books/:isbn', (req, res) => {
  // Get the id and isbn from the params
  let id = req.params.id;
  let isbn = req.params.isbn;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Find the book by isbn
    let book = readingList.books.find((b) => b.isbn === isbn);
    // Check if the book exists
    if (book) {
      // Send back the book
      res.json(book);
    } else {
      // Send back a 404 error
      res.status(404).json({ message: 'Book not found' });
    }
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Update a specific book in a reading list by isbn
app.put('/readingLists/:id/books/:isbn', (req, res) => {
  // Get the id and isbn from the params
  let id = req.params.id;
  let isbn = req.params.isbn;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Find the book by isbn
    let book = readingList.books.find((b) => b.isbn === isbn);
    // Check if the book exists
    if (book) {
      // Update the book title, author, and status
      book.title = req.body.title;
      book.author = req.body.author;
      book.status = req.body.status;
      // Send back the updated book
      res.json(book);
    } else {
      // Send back a 404 error
      res.status(404).json({ message: 'Book not found' });
    }
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Delete a specific book in a reading list by isbn
app.delete('/readingLists/:id/books/:isbn', (req, res) => {
  // Get the id and isbn from the params
  let id = req.params.id;
  let isbn = req.params.isbn;
  // Find the reading list by id
  let readingList = readingLists[id];
  // Check if the reading list exists
  if (readingList) {
    // Find the index of the book by isbn
    let index = readingList.books.findIndex((b) => b.isbn === isbn);
    // Check if the book exists
    if (index !== -1) {
      // Delete the book from the reading list books array
      readingList.books.splice(index, 1);
      // Send back a success message
      res.json({ message: 'Book deleted' });
    } else {
      // Send back a 404 error
      res.status(404).json({ message: 'Book not found' });
    }
  } else {
    // Send back a 404 error
    res.status(404).json({ message: 'Reading list not found' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
