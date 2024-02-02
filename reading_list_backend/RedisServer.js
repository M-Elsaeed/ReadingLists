// hosted at https://readinglists.onrender.com/

const express = require('express')
const redis = require('redis')
const bodyParser = require('body-parser')
const cors = require('cors')
const { randomUUID } = require('crypto')

// Express.js setup.
const app = express()
app.use(cors()) // should only add allowed origins here.
app.use(bodyParser.json())

// Redis Setup
const rootKeyName = 'ReadingLists'
const client = redis.createClient({
	password: process.env.redis_password,
	socket: {
		host: 'redis-18179.c243.eu-west-1-3.ec2.cloud.redislabs.com',
		port: 18179
	}
})

// Book Validation Utils.
const validStatuses = ['Unread', 'In Progress', 'Finished']
const validateBook = (book) => { return book.isbn && book.title && book.author && validStatuses.includes(book.status) }

// trimmed alphanumeric string only.
const cleanBookISBN = (bookISBN) => { return bookISBN.trim().replace(/[^a-z0-9]/gi, '') }

const handleError = (err, res) => {
	console.error(err)
	res.status(500).send(err.message)
}

// Create Reading List.
app.post('/reading-lists', (req, res) => {
	const name = req.body.name
	if (!name) return res.status(400).send('Name is required')

	const id = randomUUID()
	client.json.set(rootKeyName, `$.${id}`, { listName: name, books: {} })
		.then(() => res.status(201).send({ id, name }))
		.catch((err) => handleError(err, res))
})

// Read All Reading Lists
const getAllLists = (req, res) => {
	client.json.get(rootKeyName)
		.then((result) => res.send(result))
		.catch((err) => handleError(err, res))
}

app.get('/', getAllLists)
app.get('/reading-lists', getAllLists)


// Read Reading List by id
app.get('/reading-lists/:id', (req, res) => {
	const id = req.params.id
	client.json.get(rootKeyName, { path: `$.${id}` })
		.then((list) => {
			if (!list) return res.status(404).send('Reading list not found')

			res.status(200).send(list)
		})
		.catch((err) => handleError(err, res))
})

// Update Reading List by id
app.put('/reading-lists/:id', (req, res) => {
	const id = req.params.id
	const name = req.body.name
	if (!name) return res.status(400).send('Name is required')

	client.json.set(rootKeyName, `$.${id}.listName`, name)
		.then((updateVerdict) => {
			if (!updateVerdict) return res.status(404).send('Reading list not found')

			res.status(201).send({ id, name })
		})
		.catch(err => handleError(err, res))
})

// Delete Reading List by id
app.delete('/reading-lists/:id', (req, res) => {
	const id = req.params.id
	client.json.del(rootKeyName, `$.${id}`)
		.then((deleteVerdict) => {
			if (!deleteVerdict) return res.status(404).send('Reading list not found')

			res.status(201).send(`deleted ${id}`)
		})
		.catch((err) => handleError(err, res))
})

// Create Book in reading list.
app.post('/reading-lists/:id/books', (req, res) => {

	const book = req.body.book
	if (!book) return res.status(400).send('Book is required')
	if (!validateBook(book)) return res.status(400).send('Book is invalid')
	book.isbn = cleanBookISBN(book.isbn)


	// only set if not exists
	const id = req.params.id
	client.json.set(rootKeyName, `$.${id}.books["${cleanBookISBN(book.isbn)}"]`, book, { NX: true })
		.then((addVerdict) => {
			if (!addVerdict) return res.status(404).send('Failed to add, book already exists or reading list does not exist.')

			res.status(201).send(`Added Book ${book.title} with ISBN: ${book.isbn} to list ${id}`)
		})
		.catch((err) => handleError(err, res))
})

// Read Book in reading list by ISBN
app.get('/reading-lists/:id/books/:isbn', (req, res) => {
	const id = req.params.id
	const bookisbn = cleanBookISBN(req.params.isbn)

	client.json.get(rootKeyName, { path: `$.${id}.books["${bookisbn}"]` })
		.then((book) => {
			if (!book) return res.status(404).send('Reading list or book not found')

			res.status(200).send(book)
		})
		.catch((err) => handleError(err, res))
})

// update book by ISBN
app.put('/reading-lists/:id/books/:isbn', (req, res) => {
	const id = req.params.id
	const book = req.body.book
	if (!book) return res.status(400).send('Book is required')
	if (!validateBook(book)) return res.status(400).send('Book is invalid')
	const bookisbn = cleanBookISBN(req.params.isbn)
	book.isbn = bookisbn

	client.json.set(rootKeyName, `$.${id}.books["${bookisbn}"]`, book, { XX: true })
		.then((updateVerdict) => {
			if (!updateVerdict) return res.status(404).send('Failed to modify book, check book isbn or reading list does not exist.')

			res.status(201).send(`Updated Books ${bookisbn}`)
		})
		.catch((err) => handleError(err, res))
})

// delete book by ISBN
app.delete('/reading-lists/:id/books/:bookisbn', (req, res) => {
	const id = req.params.id
	const bookisbn = cleanBookISBN(req.params.bookisbn)

	client.json.del(rootKeyName, `$.${id}.books["${bookisbn}"]`)
		.then((deleteVerdict) => {
			if (!deleteVerdict) return res.status(404).send('Reading list not found or book not found')

			res.status(201).send(`deleted ${id}`)
		})
		.catch((err) => handleError(err, res))
})

client.connect()
	.then(() => {
		console.log('Connected to Redis')
		app.listen(3000, () => console.log('Server listening on port 3000'))
	})
	.catch(err => console.error('Redis connection failed', err))