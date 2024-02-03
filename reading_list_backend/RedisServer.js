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
const readingListsKeyName = 'ReadingLists'
const readingListsInfoKeyName = 'ListsInfo'

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
	res.status(500).send({ message: err.message })
}

// Create Reading List.
app.post('/reading-lists', (req, res) => {
	const listName = req.body.listName
	if (!listName) return res.status(400).send({ message: 'List Name is required' })

	const listID = randomUUID()
	let operations = [
		client.json.set(readingListsKeyName, `$.${listID}`, { listName: listName, books: {} }),
		client.json.set(readingListsInfoKeyName, `$.${listID}`, { listName: listName })
	]
	Promise.all(operations)
		.then(() => res.status(201).send({ listID, listName }))
		.catch((err) => handleError(err, res))
})

// Read All Reading Lists
const getAllLists = (req, res) => {
	client.json.get(readingListsKeyName)
		.then((result) => res.send(result))
		.catch((err) => handleError(err, res))
}

app.get('/', getAllLists)
app.get('/reading-lists', getAllLists)

// Get Only Reading Lists Info (listID, listName)
app.get('/reading-lists-info', (req, res) => {
	client.json.get(readingListsInfoKeyName)
		.then((result) => res.send(result))
		.catch((err) => handleError(err, res))
})

// Read Reading List by id
app.get('/reading-lists/:listID', (req, res) => {
	const listID = req.params.listID
	client.json.get(readingListsKeyName, { path: `$.${listID}` })
		.then((list) => {
			if (!list || !list[0]) return res.status(404).send({ message: 'Reading list not found' })

			res.status(200).send(list[0])
		})
		.catch((err) => handleError(err, res))
})

// Update Reading List by id
app.put('/reading-lists/:listID', (req, res) => {
	const listID = req.params.listID
	const listName = req.body.listName
	if (!listName) return res.status(400).send({ message: 'List Name is required' })

	let operations = [
		client.json.set(readingListsKeyName, `$.${listID}.listName`, listName),
		client.json.set(readingListsInfoKeyName, `$.${listID}`, { listName: listName })
	]
	Promise.all(operations)
		.then((results) => {
			if (!results[0]) return res.status(404).send({ message: 'Reading list not found' })

			res.status(200).send({ listID, listName })
		})
		.catch(err => handleError(err, res))
})

// Delete Reading List by id
app.delete('/reading-lists/:listID', (req, res) => {
	const listID = req.params.listID
	let operations = [
		client.json.del(readingListsKeyName, `$.${listID}`),
		client.json.del(readingListsInfoKeyName, `$.${listID}`)
	]
	Promise.all(operations)
		.then((results) => {
			if (!results[0]) return res.status(404).send({ message: 'Reading list not found' })

			res.status(204).send({ message: `deleted ${listID}` })
		})
		.catch((err) => handleError(err, res))
})

// Create Book in reading list.
app.post('/reading-lists/:listID/books', (req, res) => {

	const book = req.body.book
	if (!book) return res.status(400).send({ message: 'Book is required' })
	if (!validateBook(book)) return res.status(400).send({ message: 'Book is invalid' })
	book.isbn = cleanBookISBN(book.isbn)

	// only set if not exists
	const listID = req.params.listID
	client.json.set(readingListsKeyName, `$.${listID}.books["${cleanBookISBN(book.isbn)}"]`, book, { NX: true })
		.then((addVerdict) => {
			if (!addVerdict) return res.status(404).send({ message: 'Failed to add, book already exists or reading list does not exist.' })

			res.status(201).send({ message: `Added Book ${book.title} with ISBN: ${book.isbn} to list ${listID}` })
		})
		.catch((err) => handleError(err, res))
})

// Read Book in reading list by ISBN
app.get('/reading-lists/:listID/books/:isbn', (req, res) => {
	const listID = req.params.listID
	const bookisbn = cleanBookISBN(req.params.isbn)

	client.json.get(readingListsKeyName, { path: `$.${listID}.books["${bookisbn}"]` })
		.then((book) => {
			if (!book || !book[0]) return res.status(404).send({ message: 'Reading list or book not found' })

			res.status(200).send(book[0])
		})
		.catch((err) => handleError(err, res))
})

// update book by ISBN
app.put('/reading-lists/:listID/books/:isbn', (req, res) => {
	const listID = req.params.listID
	const book = req.body.book
	if (!book) return res.status(400).send({ message: 'Book is required' })
	if (!validateBook(book)) return res.status(400).send({ message: 'Book is invalid' })
	const bookisbn = cleanBookISBN(req.params.isbn)
	book.isbn = bookisbn

	client.json.set(readingListsKeyName, `$.${listID}.books["${bookisbn}"]`, book, { XX: true })
		.then((updateVerdict) => {
			if (!updateVerdict) return res.status(404).send({ message: 'Failed to modify book, check book isbn or reading list does not exist.' })

			res.status(201).send({ message: `Updated Books ${bookisbn}` })
		})
		.catch((err) => handleError(err, res))
})

// delete book by ISBN
app.delete('/reading-lists/:listID/books/:bookisbn', (req, res) => {
	const listID = req.params.listID
	const bookisbn = cleanBookISBN(req.params.bookisbn)

	client.json.del(readingListsKeyName, `$.${listID}.books["${bookisbn}"]`)
		.then((deleteVerdict) => {
			if (!deleteVerdict) return res.status(404).send({ message: 'Reading list not found or book not found' })

			res.status(204).send({ message: `deleted ${listID}` })
		})
		.catch((err) => handleError(err, res))
})

module.exports = app, client

client.connect()
	.then(() => {
		console.log('Connected to Redis')
		app.listen(3000, () => console.log('Server listening on port 3000'))
	})
	.catch(err => console.error('Redis connection failed', err))