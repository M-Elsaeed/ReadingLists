// Import mocha, supertest, and the express app
const mocha = require('mocha');
const request = require('supertest');
const app = require('./app');

// Define some sample data for testing
const sampleList = { name: 'My Reading List' };
const sampleBook = { ISBN: '978-0-14-312755-0', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', status: 'In Progress' };

// Use mocha's describe and it functions to organize the tests
describe('Reading List API', () => {
  // Test the route to create a new reading list
  it('should create a new reading list', (done) => {
    // Use supertest to send a POST request with the sample list data
    request(app)
      .post('/reading-lists')
      .send(sampleList)
      .expect(201) // Expect a 201 Created status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to have an id and name property
        res.body.id.should.be.a('string');
        res.body.name.should.equal(sampleList.name);
        // Save the id for later use
        sampleList.id = res.body.id;
      })
      .end(done); // End the test
  });

  // Test the route to get all reading lists
  it('should get all reading lists', (done) => {
    // Use supertest to send a GET request
    request(app)
      .get('/reading-lists')
      .expect(200) // Expect a 200 OK status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to be an array
        res.body.should.be.an('array');
        // Expect the response to include the sample list
        res.body.should.deep.include(sampleList);
      })
      .end(done); // End the test
  });

  // Test the route to get a single reading list by id
  it('should get a single reading list by id', (done) => {
    // Use supertest to send a GET request with the sample list id
    request(app)
      .get(`/reading-lists/${sampleList.id}`)
      .expect(200) // Expect a 200 OK status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to equal the sample list
        res.body.should.deep.equal(sampleList);
      })
      .end(done); // End the test
  });

  // Test the route to update a reading list by id
  it('should update a reading list by id', (done) => {
    // Use supertest to send a PUT request with the sample list id and a new name
    request(app)
      .put(`/reading-lists/${sampleList.id}`)
      .send({ name: 'My Updated Reading List' })
      .expect(200) // Expect a 200 OK status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to have the updated id and name
        res.body.id.should.equal(sampleList.id);
        res.body.name.should.equal('My Updated Reading List');
        // Update the sample list data
        sampleList.name = res.body.name;
      })
      .end(done); // End the test
  });

  // Test the route to delete a reading list by id
  it('should delete a reading list by id', (done) => {
    // Use supertest to send a DELETE request with the sample list id
    request(app)
      .delete(`/reading-lists/${sampleList.id}`)
      .expect(200) // Expect a 200 OK status code
      .expect((res) => {
        // Expect the response to have a message
        res.text.should.equal('Reading list deleted');
      })
      .end(done); // End the test
  });

  // Test the route to add a book to a reading list by id
  it('should add a book to a reading list by id', (done) => {
    // Use supertest to send a POST request with the sample list id and the sample book data
    request(app)
      .post(`/reading-lists/${sampleList.id}/books`)
      .send({ book: sampleBook })
      .expect(201) // Expect a 201 Created status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to equal the sample book
        res.body.should.deep.equal(sampleBook);
      })
      .end(done); // End the test
  });

  // Test the route to get all books from a reading list by id
  it('should get all books from a reading list by id', (done) => {
    // Use supertest to send a GET request with the sample list id
    request(app)
      .get(`/reading-lists/${sampleList.id}/books`)
      .expect(200) // Expect a 200 OK status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to be an array
        res.body.should.be.an('array');
        // Expect the response to include the sample book
        res.body.should.deep.include(sampleBook);
      })
      .end(done); // End the test
  });

  // Test the route to get a single book from a reading list by id and ISBN
  it('should get a single book from a reading list by id and ISBN', (done) => {
    // Use supertest to send a GET request with the sample list id and the sample book ISBN
    request(app)
      .get(`/reading-lists/${sampleList.id}/books/${sampleBook.ISBN}`)
      .expect(200) // Expect a 200 OK status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to equal the sample book
        res.body.should.deep.equal(sampleBook);
      })
      .end(done); // End the test
  });

  // Test the route to update a book in a reading list by id and ISBN
  it('should update a book in a reading list by id and ISBN', (done) => {
    // Use supertest to send a PUT request with the sample list id, the sample book ISBN, and a new status
    request(app)
      .put(`/reading-lists/${sampleList.id}/books/${sampleBook.ISBN}`)
      .send({ book: { ...sampleBook, status: 'Finished' } })
      .expect(200) // Expect a 200 OK status code
      .expect('Content-Type', /json/) // Expect a JSON response
      .expect((res) => {
        // Expect the response to have the updated book data
        res.body.ISBN.should.equal(sampleBook.ISBN);
        res.body.title.should.equal(sampleBook.title);
        res.body.author.should.equal(sampleBook.author);
        res.body.status.should.equal('Finished');
        // Update the sample book data
        sampleBook.status = res.body.status;
      })
      .end(done); // End the test
  });

  // Test the route to delete a book from a reading list by id and ISBN
  it('should delete a book from a reading list by id and ISBN', (done) => {
    // Use supertest to send a DELETE request with the sample list id and the sample book ISBN
    request(app)
      .delete(`/reading-lists/${sampleList.id}/books/${sampleBook.ISBN}`)
      .expect(200) // Expect a 200 OK status code
      .expect((res) => {
        // Expect the response to have a message
        res.text.should.equal('Book deleted');
      })
      .end(done); // End the test
  });
});
