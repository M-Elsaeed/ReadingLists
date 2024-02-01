// Import express, redis, and body-parser modules
const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomUUID } = require('crypto');
const rootKeyName = 'ReadingLists';

// Create an express app and a redis client
const app = express();
app.use(cors());
app.use(bodyParser.json());
const client = redis.createClient({
	password: 'Z4BpvcJpcFaXULRYsQylHchJ28LqlG4O', // move to env
	socket: {
		host: 'redis-18179.c243.eu-west-1-3.ec2.cloud.redislabs.com',
		port: 18179
	}
});


// Define a helper function to handle errors
const handleError = (err, res) => {
	console.error(err);
	res.status(500).send('Something went wrong');
};

// Define a helper function to validate book data
const validateBook = (book) => {
	// Check if the book has isbn, title, and author properties
	if (!book.isbn || !book.title || !book.author) {
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
	client.json.set(rootKeyName, '$.readingListID', { listName: "some listName", books: { "bookIDisisbn": { "isbn": "bookisbn", "author": "some author", "title": "some title" } } }, (err, reply) => { });
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
	client.json.get(rootKeyName)
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
	client.json.get(rootKeyName, { path: `$.${id}` })
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

	client.json.set(rootKeyName, `$.${id}.listName`, name)
		.then((setVerdict) => {

			if (!setVerdict) {
				return res.status(404).send('Reading list not found');
			}

			res.status(201).send({ id, name })
		})
		.catch((err) => handleError(err, res));
});

// Define a route to delete a reading list by id
app.delete('/reading-lists/:id', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	client.json.del(rootKeyName, `$.${id}`)
		.then((deleteVerdict) => {

			if (!deleteVerdict) {
				return res.status(404).send('Reading list not found');
			}

			res.status(201).send(`deleted ${id}`)
		})
		.catch((err) => handleError(err, res));
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

	// check not already exists
	client.json.set(rootKeyName, `$.${id}.books.${book.isbn}`, book, { NX: true })
		.then((addVerdict) => {
			if (!addVerdict) {
				return res.status(404).send('Failed to add, book already exists or reading list does not exist.');
			}

			res.status(201).send(`Added Books ${book.isbn} to list ${id}`)
		})
		.catch((err) => handleError(err, res));
});

// Define a route to get a single book from a reading list by id and isbn
app.get('/reading-lists/:id/books/:isbn', (req, res) => {
	// Get the id and isbn from the request params
	const id = req.params.id;
	const isbn = req.params.isbn;
	client.json.get(rootKeyName, { path: `$.${id}.books.${isbn}` })
		.then(book => {
			if (!book) {
				return res.status(404).send('Reading list or book not found');
			}
			res.status(200).send(book);
		})
		.catch(err => {
			return handleError(err, res);
		});
});

// Define a route to update a book in a reading list by id and isbn
app.put('/reading-lists/:id/books/:isbn', (req, res) => {
	// Get the id and isbn from the request params
	const id = req.params.id;
	const isbn = req.params.isbn;
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

	client.json.set(rootKeyName, `$.${id}.books.${book.isbn}`, book, { XX: true })
		.then((addVerdict) => {
			if (!addVerdict) {
				return res.status(404).send('Failed to modify book, check book isbn or reading list does not exist.');
			}

			res.status(201).send(`Updated Books ${book.isbn}`)
		})
		.catch((err) => handleError(err, res));
});

// Define a route to delete a reading list by id
app.delete('/reading-lists/:id/books/:bookisbn', (req, res) => {
	// Get the id from the request params
	const id = req.params.id;
	const bookisbn = req.params.bookisbn;
	client.json.del(rootKeyName, `$.${id}.books.${bookisbn}`)
		.then((deleteVerdict) => {

			if (!deleteVerdict) {
				return res.status(404).send('Reading list not found or book not found');
			}

			res.status(201).send(`deleted ${id}`)
		})
		.catch((err) => handleError(err, res));
});

client.connect()
	.then(() => {
		console.log('Connected to Redis')
		app.listen(3000, () => console.log('Server listening on port 3000'));
	})
	.catch(err => console.error('Redis connection failed', err));