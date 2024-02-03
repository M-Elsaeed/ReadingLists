// Import the required modules
const request = require('supertest')
const app = require('./RedisServer')

// Define some sample data for testing
const sampleReadingList = {
  listName: 'My Reading List',
}

const sampleBook = {
  isbn: "3551557470",
  title: "Harry Potter and the Deathly Hallows",
  author: "J. K. Rowling",
  status: "Unread",
  image: "http://covers.openlibrary.org/b/id/10110415-M.jpg"
}

const createdReadingLists = []

const createReadingList = async (listObj) => {
  const response = await request(app).post('/reading-lists').send(listObj)
  createdReadingLists.push(response.body.listID)
  return response
}

// Test the POST /reading-lists endpoint
describe('POST /reading-lists', () => {
  it('should create a new reading list and return 201 status code',
    async () => {
      const response = await createReadingList(sampleReadingList)
      expect(response.statusCode).toBe(202)
      expect(response.body).toHaveProperty('listID')
      expect(response.body.listName).toBe(sampleReadingList.listName)
    })

  it('should return 400 status code if the name is missing or invalid',
    async () => {
      const response = await createReadingList({ listName: '' })
      expect(response.statusCode).toBe(400)
    })
})


// Test the GET /reading-lists endpoint
describe('GET /reading-lists', () => {
  it('should return an array of all reading lists and 200 status code',
    async () => {
      // Create some reading lists in the database
      let listNames = ['Reading List 1', 'Reading List 2', 'Reading List 3']
      let responses = []

      for (let i = 0; i < listNames.length; i++) {
        responses.push(await createReadingList({ listName: listNames[i] }))
      }

      const lists = await request(app).get('/reading-lists')
      expect(responses.length).toBe(3)
      expect(Object.keys(lists).length).toBeGreaterThanOrEqual(3)
      responses.forEach(response => expect(response.statusCode).toBe(201))
      responses.forEach((response, i) => expect(lists.body[response.body.listID]?.listName).toBe(listNames[i]))
    })
})

// Test the GET /reading-lists/:listID endpoint
describe('GET /reading-lists/:listID', () => {
  it('should return the reading list with the given listID and 200 status code',
    async () => {
      // Create a reading list in the database
      const readingList = await createReadingList(sampleReadingList)
      // console.log(readingList)
      const response = await request(app).get(`/reading-lists/${readingList.body.listID}`)
      expect(response.statusCode).toBe(200)
      // expect(response.body).toHaveProperty('listID')
      // expect(response.body.listID).toBe(readingList.listID)
      expect(response.body.listName).toBe(readingList.body.listName)
    })

  it('should return 404 status code if the reading list does not exist',
    async () => {
      const response = await request(app).get('/reading-lists/999')
      expect(response.statusCode).toBe(404)
      // expect(response.body).toHaveProperty('error')
    })
})

// Test the PUT /reading-lists endpoint
describe('PUT /reading-lists/:listID', () => {
  it('should update the reading list name and return 200 status code',
    async () => {
      // Create a reading list in the database
      const readingList = await createReadingList(sampleReadingList)

      // Update the reading list name
      const newName = 'My Updated Reading List'

      const response = await request(app)
        .put(`/reading-lists/${readingList.body.listID}`)
        .send({ listName: newName })


      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('listID')
      expect(response.body.listID).toBe(readingList.body.listID)
      expect(response.body.listName).toBe(newName)
    })

  it('should return 400 status code if the listID or name is missing or invalid',
    async () => {

      const response = await request(app)
        .put('/reading-lists/')
        .send({ listName: '' })

      expect(response.statusCode).toBe(404)

      // expect(response.body).toHaveProperty('error')
    })

  it('should return 404 status code if the reading list does not exist',
    async () => {

      const response = await request(app)
        .put('/reading-lists/999')
        .send({ listName: 'Nonexistent Reading List' })

      expect(response.statusCode).toBe(404)

      // expect(response.body).toHaveProperty('error')
    })
})

// Test the DELETE /reading-lists/:listID endpoint
describe('DELETE /reading-lists/:listID', () => {
  it('should delete the reading list with the given listID and return 204 status code',
    async () => {
      // Create a reading list in the database
      const readingList = await createReadingList(sampleReadingList)


      const response = await request(app).delete(`/reading-lists/${readingList.body.listID}`)

      expect(response.statusCode).toBe(204)

      const listResponse = await request(app).get(`/reading-lists/${readingList.body.listID}`)

      expect(listResponse.statusCode).toBe(404)



    })

  it('should return 404 status code if the reading list does not exist',
    async () => {

      const response = await request(app).delete('/reading-lists/999')

      expect(response.statusCode).toBe(404)

      // expect(response.body).toHaveProperty('error')
    })
})

// Test the POST /reading-lists/:listID/books endpoint
describe('POST /reading-lists/:listID/books', () => {
  it('should create a new book in the reading list and return 201 status code',
    async () => {
      // Create a reading list in the database
      const readingList = await createReadingList(sampleReadingList)
      let response = await request(app)
        .post(`/reading-lists/${readingList.body.listID}/books`)
        .send({ book: sampleBook })

      expect(response.statusCode).toBe(201)
      const listResponse = await request(app).get(`/reading-lists/${readingList.body.listID}`)
      expect(listResponse.body.books[sampleBook.isbn].isbn).toBe(sampleBook.isbn)
      expect(listResponse.body.books[sampleBook.isbn].title).toBe(sampleBook.title)
      expect(listResponse.body.books[sampleBook.isbn].author).toBe(sampleBook.author)
      expect(listResponse.body.books[sampleBook.isbn].status).toBe(sampleBook.status)
      expect(listResponse.body.books[sampleBook.isbn].image).toBe(sampleBook.image)
    })

  it('should return 400 status code if the book object is missing or invalid',
    async () => {
      // Create a reading list in the database
      const readingList = await createReadingList(sampleReadingList)


      const response = await request(app)
        .post(`/reading-lists/${readingList.listID}/books`)
        .send({ book: {} })

      expect(response.statusCode).toBe(400)

      // expect(response.body).toHaveProperty('error')
    })

  it('should return 404 status code if the reading list does not exist',
    async () => {

      const response = await request(app)
        .post('/reading-lists/999/books')
        .send({ book: sampleBook })

      expect(response.statusCode).toBe(404)

      // expect(response.body).toHaveProperty('error')
    })
})

// Test the GET /reading-lists/:listID/books/:ISBN endpoint
describe('GET /reading-lists/:listID/books/:ISBN', () => {
  it('should return the book with the given ISBN in the reading list and 200 status code',
    async () => {
      // Create a reading list and a book in the database
      const readingList = await createReadingList(sampleReadingList)

      const createdBook = await request(app).post(`/reading-lists/${readingList.body.listID}/books`).send({ book: sampleBook })

      const response = await request(app).get(`/reading-lists/${readingList.body.listID}/books/${sampleBook.isbn}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.isbn).toBe(sampleBook.isbn)
      expect(response.body.title).toBe(sampleBook.title)
      expect(response.body.author).toBe(sampleBook.author)
      expect(response.body.status).toBe(sampleBook.status)
      expect(response.body.image).toBe(sampleBook.image)
    })

  it('should return 404 status code if the reading list or the book does not exist',
    async () => {

      const response = await request(app).get(
        '/reading-lists/999/books/978-0-123456-47-2'
      )

      expect(response.statusCode).toBe(404)

      // expect(response.body).toHaveProperty('error')
    })
})

// Test the PUT /reading-lists/:listID/books/:ISBN endpoint
describe('PUT /reading-lists/:listID/books/:ISBN', () => {
  it('should update the book with the given ISBN in the reading list and return 200 status code',
    async () => {
      const newStatus = 'Finished'

      // Create a reading list and a book in the database
      const readingList = await createReadingList(sampleReadingList)
      // Update the book status
      await request(app).post(`/reading-lists/${readingList.body.listID}/books`).send({ book: sampleBook })
      await request(app).put(`/reading-lists/${readingList.body.listID}/books/${sampleBook.isbn}`).send({ book: { ...sampleBook, status: newStatus } })
      getBookResponse = await request(app).get(`/reading-lists/${readingList.body.listID}/books/${sampleBook.isbn}`)

      expect(getBookResponse.statusCode).toBe(200)
      expect(getBookResponse.body.isbn).toBe(sampleBook.isbn)
      expect(getBookResponse.body.title).toBe(sampleBook.title)
      expect(getBookResponse.body.author).toBe(sampleBook.author)
      expect(getBookResponse.body.status).toBe(newStatus)
      expect(getBookResponse.body.image).toBe(sampleBook.image)
    })

  it("should return 400 status code if the book object is missing or invalid",
    async () => {
      // Create a reading list and a book in the database 
      const readingList = await createReadingList(sampleReadingList)
      await request(app).post(`/reading-lists/${readingList.body.listID}/books`).send({ book: sampleBook })
      const response = await request(app).put(`/reading-lists/${readingList.body.listID}/books/${sampleBook.isbn}`).send({ book: {} })
      expect(response.statusCode).toBe(400)

      // expect(response.body).toHaveProperty('error')

    })

  it("should return 404 status code if the reading list or the book does not exist",
    async () => {
      const response = await request(app).put("/reading-lists/999/books/978-0-123456-47-2").send({ book: sampleBook })
      expect(response.statusCode).toBe(404)
      // expect(response.body).toHaveProperty("error")
    })
})

// Test the DELETE /reading-lists/:listID/books/:ISBN endpoint 
describe("DELETE /reading-lists/:listID/books/:ISBN", () => {
  it("should delete the book with the given ISBN from the reading list and return 204 status code",
    async () => {
      // Create a reading list and a book in the database 
      const readingList = await createReadingList(sampleReadingList)
      await request(app).post(`/reading-lists/${readingList.body.listID}/books`).send({ book: sampleBook })
      const response = await request(app).delete(`/reading-lists/${readingList.body.listID}/books/${sampleBook.isbn}`)
      expect(response.statusCode).toBe(204)
    })

  it("should return 404 status code if the reading list or the book does not exist",
    async () => {
      const response = await request(app).delete("/reading-lists/999/books/978-0-123456-47-2")
      expect(response.statusCode).toBe(404)
    })
})

// Remove all created lists to avoid cluttering the DB with test data.
describe("DELETE /reading-lists/:listID/", () => {
  it("should delete all test-created reading lists",
    async () => {
      createdReadingLists.forEach(async (listID) => {
        await request(app).delete(`/reading-lists/${listID}`);
      })
    })
})