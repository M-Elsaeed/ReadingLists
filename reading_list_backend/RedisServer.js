// Import express, redis, and body-parser modules
const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const rootKeyName = 'ReadingLists';
const { randomUUID } = require('crypto');

// Create an express app and a redis client
const app = express();
const client = redis.createClient({
	password: 'Z4BpvcJpcFaXULRYsQylHchJ28LqlG4O',
	socket: {
		host: 'redis-18179.c243.eu-west-1-3.ec2.cloud.redislabs.com',
		port: 18179
	}
});

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Define a helper function to handle errors
const handleError = (err, res) => {
	console.error(err);
	res.status(500).send('Something went wrong');
};

// Define a helper function to validate book data
const validateBook = (book) => {
	// Check if the book has ISBN, title, and author properties
	if (!book.ISBN || !book.title || !book.author) {
		return false;
	}
	// Check if the book status is one of the valid values
	const validStatus = ['Unread', 'In Progress', 'Finished'];
	if (!validStatus.includes(book.status)) {
		return false;
	}
	// Return true if the book is valid
	return true;
};

app.get('/', (req, res) => {
	client.json.set(rootKeyName, '$.readingListID', { listName: "some listName", books: { "bookIDisISBN": { "isbn": "bookisbn", "author": "some author", "title": "some title" } } }, (err, reply) => { });
	res.send('Hello World!');
});

// Define a route to create a new reading list
app.post('/reading-lists', (req, res) => {
	// Get the name of the reading list from the request body
	const name = req.body.name;
	// Check if the name is provided
	if (!name) {
		return res.status(400).send('Name is required');
	}
	// Generate a unique id for the reading list
	const id = randomUUID();
	// Store the reading list in the redis database with the name and an empty array of books
	client.json.set(rootKeyName, `$.${id}`, { listName: name, books: {} })
		.then(() => res.status(201).send({ id, name }))
		.catch((err) => handleError(err, res));
});

// Define a route to get all reading lists
app.get('/reading-lists', (req, res) => {
	client.json.get(rootKeyName, `$`)
		.then(allLists => {
			res.status(200).send(allLists);
		})
		.catch(err => {
			return handleError(err, res);
		});
});

// Define a route to get a single reading list by id
app.get('/reading-lists/:id', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	// Get the details of the reading list from the redis database
	client.json.get(rootKeyName, `$.${id}`)
		.then(list => {
			if (!list) {
				return res.status(404).send('Reading list not found');
			}
			res.status(200).send(list);
		})
		.catch(err => {
			return handleError(err, res);
		});
});

// Define a route to update a reading list by id
app.put('/reading-lists/:id', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	// Get the name from the request body
	const name = req.body.name;
	// Check if the name is provided
	if (!name) {
		return res.status(400).send('Name is required');
	}
	// Update the name of the reading list in the redis database
	client.hset(id, 'name', name, (err, reply) => {
		// Handle any errors
		if (err) {
			return handleError(err, res);
		}
		// Check if the list exists
		if (reply === 0) {
			return res.status(404).send('Reading list not found');
		}
		// Send a success response with the id and name of the reading list
		res.status(200).send({ id, name });
	});
});

// Define a route to delete a reading list by id
app.delete('/reading-lists/:id', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	// Delete the reading list from the redis database
	client.del(id, (err, reply) => {
		// Handle any errors
		if (err) {
			return handleError(err, res);
		}
		// Check if the list exists
		if (reply === 0) {
			return res.status(404).send('Reading list not found');
		}
		// Send a success response with a message
		res.status(200).send('Reading list deleted');
	});
});

// Define a route to add a book to a reading list by id
app.post('/reading-lists/:id/books', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	// Get the book from the request body
	const book = req.body.book;
	// Check if the book is provided
	if (!book) {
		return res.status(400).send('Book is required');
	}
	// Check if the book is valid
	if (!validateBook(book)) {
		return res.status(400).send('Book is invalid');
	}
	// Get the books array of the reading list from the redis database
	client.hget(id, 'books', (err, books) => {
		// Handle any errors
		if (err) {
			return handleError(err, res);
		}
		// Check if the list exists
		if (!books) {
			return res.status(404).send('Reading list not found');
		}
		// Parse the books array
		books = JSON.parse(books);
		// Add the book to the books array
		books.push(book);
		// Update the books array of the reading list in the redis database
		client.hset(id, 'books', JSON.stringify(books), (err, reply) => {
			// Handle any errors
			if (err) {
				return handleError(err, res);
			}
			// Send a success response with the book
			res.status(201).send(book);
		});
	});
});

// Define a route to get all books from a reading list by id
app.get('/reading-lists/:id/books', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	// Get the books array of the reading list from the redis database
	client.hget(id, 'books', (err, books) => {
		// Handle any errors
		if (err) {
			return handleError(err, res);
		}
		// Check if the list exists
		if (!books) {
			return res.status(404).send('Reading list not found');
		}
		// Parse the books array
		books = JSON.parse(books);
		// Send a success response with the books array
		res.status(200).send(books);
	});
});

// Define a route to get a single book from a reading list by id and ISBN
app.get('/reading-lists/:id/books/:ISBN', (req, res) => {
	// Get the id and ISBN from the request params
	const id = req.params.id;
	const ISBN = req.params.ISBN;
	// Get the books array of the reading list from the redis database
	client.hget(id, 'books', (err, books) => {
		// Handle any errors
		if (err) {
			return handleError(err, res);
		}
		// Check if the list exists
		if (!books) {
			return res.status(404).send('Reading list not found');
		}
		// Parse the books array
		books = JSON.parse(books);
		// Find the book with the matching ISBN
		const book = books.find(book => book.ISBN === ISBN);
		// Check if the book exists
		if (!book) {
			return res.status(404).send('Book not found');
		}
		// Send a success response with the book
		res.status(200).send(book);
	});
});

// Define a route to update a book in a reading list by id and ISBN
app.put('/reading-lists/:id/books/:ISBN', (req, res) => {
	// Get the id and ISBN from the request params
	const id = req.params.id;
	const ISBN = req.params.ISBN;
	// Get the book from the request body
	const book = req.body.book;
	// Check if the book is provided
	if (!book) {
		return res.status(400).send('Book is required');
	}
	// Check if the book is valid
	if (!validateBook(book)) {
		return res.status(400).send('Book is invalid');
	}
	// Get the books array of the reading list from the redis database
	client.hget(id, 'books', (err, books) => {
		// Handle any errors
		if (err) {
			return handleError(err, res);
		}
		// Check if the list exists
		if (!books) {
			return res.status(404).send('Reading list not found');
		}
		// Parse the books array
		books = JSON.parse(books);
		// Find the index of the book with the matching ISBN
		const index = books.findIndex(book => book.ISBN === ISBN);
		// Check if the book exists
		if (index === -1) {
			return res.status(404).send('Book not found');
		}
		// Replace the book at the index with the new book
		books[index] = book;
		// Update the books array of the reading list in the redis database
		client.hset(id, 'books', JSON.stringify(books), (err, reply) => {
			// Handle any errors
			if (err) {
				return handleError(err, res);
			}
			// Send a success response with the book
			res.status(200).send(book);
		});
	});
});

client.connect()
	.then(() => {
		console.log('Connected to Redis')
		app.listen(3000, () => console.log('Server listening on port 3000'));
	})
	.catch(err => console.error('Redis connection failed', err));