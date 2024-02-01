const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomUUID } = require('crypto');

const rootKeyName = 'ReadingLists';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = redis.createClient({
	password: process.env.redis_password,
	socket: {
		host: 'redis-18179.c243.eu-west-1-3.ec2.cloud.redislabs.com',
		port: 18179
	}
});

const handleError = (err, res) => {
	console.error(err);
	res.status(500).send('Something went wrong');
};

const validateBook = (book) => {
	if (!book.isbn || !book.title || !book.author) {
		return false;
	}
	
	const validStatus = ['Unread', 'In Progress', 'Finished'];
	if (!validStatus.includes(book.status)) {
		return false;
	}
	
	return true;
};

const cleanBookISBN = (bookISBN) => {
	// trimmed alphanumeric string only.
	return bookISBN.trim().replace(/[^a-z0-9]/gi, '');
};

app.get('/', (req, res) => {
	client.json.get(rootKeyName)
	.then(result => res.send(result))
	.catch(err => res.send(err))
});

app.post('/reading-lists', (req, res) => {
	const name = req.body.name;
	if (!name) {
		return res.status(400).send('Name is required');
	}
	
	const id = randomUUID();
	client.json.set(rootKeyName, `$.${id}`, { listName: name, books: {} })
		.then(() => res.status(201).send({ id, name }))
		.catch((err) => handleError(err, res));
});

app.get('/reading-lists', (req, res) => {
	client.json.get(rootKeyName)
		.then(allLists => {
			res.status(200).send(allLists);
		})
		.catch(err => {
			return handleError(err, res);
		});
});

app.get('/reading-lists/:id', (req, res) => {
	const id = req.params.id;
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

app.put('/reading-lists/:id', (req, res) => {
	const id = req.params.id;
	const name = req.body.name;
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

app.delete('/reading-lists/:id', (req, res) => {
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

app.post('/reading-lists/:id/books', (req, res) => {
	const id = req.params.id;
	const book = req.body.book;
	if (!book) {
		return res.status(400).send('Book is required');
	}
	if (!validateBook(book)) {
		return res.status(400).send('Book is invalid');
	}

	client.json.set(rootKeyName, `$.${id}.books["${cleanBookISBN(book.isbn)}"]`, book, { NX: true })
		.then((addVerdict) => {
			if (!addVerdict) {
				return res.status(404).send('Failed to add, book already exists or reading list does not exist.');
			}
			res.status(201).send(`Added Books ${book.isbn} to list ${id}`)
		})
		.catch((err) => handleError(err, res));
});

app.get('/reading-lists/:id/books/:isbn', (req, res) => {
	const id = req.params.id;
	const bookisbn = cleanBookISBN(req.params.isbn);
	client.json.get(rootKeyName, { path: `$.${id}.books["${bookisbn}"]` })
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

app.put('/reading-lists/:id/books/:isbn', (req, res) => {
	const id = req.params.id;
	const book = req.body.book;
	const bookisbn = cleanBookISBN(req.params.isbn);
	if (!book) {
		return res.status(400).send('Book is required');
	}
	if (!validateBook(book)) {
		return res.status(400).send('Book is invalid');
	}

	client.json.set(rootKeyName, `$.${id}.books["${bookisbn}"]`, book, { XX: true })
		.then((addVerdict) => {
			if (!addVerdict) {
				return res.status(404).send('Failed to modify book, check book isbn or reading list does not exist.');
			}
			res.status(201).send(`Updated Books ${bookisbn}`)
		})
		.catch((err) => handleError(err, res));
});

app.delete('/reading-lists/:id/books/:bookisbn', (req, res) => {
	const id = req.params.id;
	const bookisbn = cleanBookISBN(req.params.bookisbn);
	client.json.del(rootKeyName, `$.${id}.books["${bookisbn}"]`)
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