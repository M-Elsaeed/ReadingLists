# Mohammed Ehab's Reading Lists App

### Description

The App Allows you to perform CRUD operations on reading lists and also on books within each reading list.

### How to Use the APP?
- **Easy Way**: Frontend Web App is hosted [Reading Lists Web App](https://m-elsaeed.github.io/ReadingLists/)
- **The Other Way**: Backend API
	- You can use postman or any library to call the Backend API Endpoints directly.
	- The API is hosted at [https://readinglists.onrender.com](https://readinglists.onrender.com/)
 
### What was implemented and Technologies used?
- **Backend**
    - Redis NoSQL Database.
    - Express.js Node Backend Server.
    - Supertest + Jest for Backend Testing.
    - Backend CI/CD. Automatic test running and deployments upon commits to master.
    - API Detailed Documentation.
- **Frontend**
    - Responsive React Frontend (Tested for mobile & desktop).
    - Axios for server calls and [Open Library API](https://openlibrary.org/) calls for search, and book covers.
- **Hosting**
    - Backend hosted at Onrender.
    - Frontend hosted at Github Pages.


### Extra Features Implemented
- Lists (Create, Read, Update, Delete)

- Add thourgh Search Feature

![image](https://github.com/M-Elsaeed/ReadingLists/assets/33024315/993efef2-0e59-4435-8274-0e9ca076a4bd)

- Automatic Testing and Deployment (CI/CD) for Backend.

![image](https://github.com/M-Elsaeed/ReadingLists/assets/33024315/8af0290c-e6e1-4111-88ff-e9ad0db39029)

- Light & Dark Modes

![image](https://github.com/M-Elsaeed/ReadingLists/assets/33024315/943a3f23-0fe3-4713-ab51-d9543eb55458)

<br />
<br />
<br />

# Table of Contents
- [Backend Design](#backend-design)
  - [Data Model](#data-model)
  - [Why this Design?](#why-this-design)
  - [Database Snapshot](#database-snapshot)
- [API Specification. (CRUD-ordered for Lists then Books)](#api-specification-crud-ordered-for-lists-then-books)
  - [`POST /reading-lists`](#post-reading-lists)
      - [Description](#description-1)
      - [Request](#request)
      - [Response](#response)
      - [Status Codes](#status-codes)
      - [Example](#example)
  - [`GET /` or `GET /reading-lists`](#get--or-get-reading-lists)
      - [Description](#description-2)
      - [Request](#request-1)
      - [Response](#response-1)
      - [Status Codes](#status-codes-1)
      - [Example](#example-1)
  - [`GET /reading-lists-info`](#get-reading-lists-info)
      - [Description](#description-3)
      - [Request](#request-2)
      - [Response](#response-2)
      - [Status Codes](#status-codes-2)
      - [Example](#example-2)
  - [`PUT /reading-lists/:listID`](#put-reading-listslistid)
      - [Description](#description-4)
      - [Request](#request-3)
      - [Response](#response-3)
      - [Status Codes](#status-codes-3)
      - [Example](#example-3)
  - [`DELETE /reading-lists/:listID`](#delete-reading-listslistid)
      - [Description](#description-5)
      - [Request](#request-4)
      - [Response](#response-4)
      - [Status Codes](#status-codes-4)
      - [Example](#example-4)
  - [`GET /reading-lists/:listID`](#get-reading-listslistid)
      - [Description](#description-6)
      - [Request](#request-5)
      - [Response](#response-5)
      - [Status Codes](#status-codes-5)
      - [Example](#example-5)
  - [`PUT /reading-lists/:listID/books`](#put-reading-listslistidbooks)
      - [Description](#description-7)
      - [Request](#request-6)
      - [Response](#response-6)
      - [Status Codes](#status-codes-6)
      - [Example](#example-6)
  - [`GET /reading-lists/:listID/books/:bookISBN`](#get-reading-listslistidbooksbookisbn)
      - [Description](#description-8)
      - [Request](#request-7)
      - [Response](#response-7)
      - [Status Codes](#status-codes-7)
      - [Example](#example-7)
  - [`PUT /reading-lists/:listID/books/:isbn`](#put-reading-listslistidbooksisbn)
      - [Description](#description-9)
      - [Request](#request-8)
      - [Response](#response-8)
      - [Status Codes](#status-codes-8)
      - [Example](#example-8)
  - [`DELETE /reading-lists/:listID/books/:bookisbn`](#delete-reading-listslistidbooksbookisbn)
      - [Description](#description-10)
      - [Request](#request-9)
      - [Response](#response-9)
      - [Status Codes](#status-codes-9)
      - [Example](#example-9)

## Backend Design

### Data Model

The API uses two JSON keys in Redis to store the reading lists and their information:

- `ReadingLists`: This key contains an object with the list IDs as keys and the list objects as values. Each list object has the following properties:
  - `listName`: The name of the list.
  - `books`: An object with the book ISBNs as keys and the book objects as values. Each book object has the following properties:
    - `isbn`: The ISBN of the book.
    - `title`: The title of the book.
    - `author`: The author of the book.
    - `status`: The reading status of the book. It can be one of the following values: `Unread`, `In Progress`, or `Finished`.
    - `image`: optional value set by a default if not provided on create.

- `ListsInfo`: This key contains an object with the list IDs as keys and the list information objects as values. Each list information object has the following property:
  - `listName`: The name of the list.

### Why this Design?

The JSON values can be manipulated and read without (reading -> parsing -> modifying -> reserializing -> writing back). 

This allows for super efficient CRUD at both list- and book- level.

### Database Snapshot

![image](https://github.com/M-Elsaeed/ReadingLists/assets/33024315/4fbeb940-dd78-4dbe-b0f3-4af3baa259dd)

___

## API Specification. (CRUD-ordered for Lists then Books)

The API exposes the following endpoints:

---

### `POST /reading-lists`

##### Description

This endpoint creates a new reading list with a given name and returns the list ID and name.

##### Request

The request body must contain a JSON object with the following property:

- `listName`: The name of the list.

##### Response

The response body contains a JSON object with the following properties:

- `listID`: The ID of the created list.
- `listName`: The name of the created list.

##### Status Codes

- `201`: The list was created successfully.
- `400`: The list name was not provided or was invalid.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"listName\": \"My Reading List\"}" https://readinglists.onrender.com/reading-lists
```

```json
{
  "listID": "6e2053c6-fca1-4d7f-975a-ca29c0e31663",
  "listName": "My Reading List"
}
```

---

### `GET /` or `GET /reading-lists`

##### Description

This endpoint returns all the reading lists and their books.

##### Request

No parameters are required.

##### Response

The response body contains a JSON object with the list IDs as keys and the list objects as values.

##### Status Codes

- `200`: The lists were retrieved successfully.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X GET https://readinglists.onrender.com/reading-lists
```

```json
{
  "6e2053c6-fca1-4d7f-975a-ca29c0e31663": {
    "listName": "My Reading List",
    "books": {
      "9780143127550": {
        "isbn": "9780143127550",
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "status": "In Progress"
      },
      "9780062316097": {
        "isbn": "9780062316097",
        "title": "The Martian",
        "author": "Andy Weir",
        "status": "Unread"
      }
    }
  }
}
```

---

### `GET /reading-lists-info`

##### Description

This endpoint returns the information of all the reading lists.

##### Request

No parameters are required.

##### Response

The response body contains a JSON object with the list IDs as keys and the list information objects as values.

##### Status Codes

- `200`: The list information was retrieved successfully.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X GET https://readinglists.onrender.com/reading-lists-info
```

```json
{
  "6e2053c6-fca1-4d7f-975a-ca29c0e31663": {
    "listName": "My Reading List"
  }
}
```

---

### `PUT /reading-lists/:listID`

##### Description

This endpoint updates the name of a specific reading list by its ID and returns the updated list ID and name.

##### Request

The request must include the list ID as a path parameter and a JSON object with the following property in the body:

- `listName`: The new name of the list.

##### Response

The response body contains a JSON object with the following properties:

- `listID`: The ID of the updated list.
- `listName`: The name of the updated list.

##### Status Codes

- `200`: The list was updated successfully.
- `400`: The list name was not provided or was invalid.
- `404`: The list was not found.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"listName\": \"Edited List Name\"}" https://readinglists.onrender.com/reading-lists/6e2053c6-fca1-4d7f-975a-ca29c0e31663
```

```json
{
  "listID": "6e2053c6-fca1-4d7f-975a-ca29c0e31663",
  "listName": "Edited List Name"
}
```

---

### `DELETE /reading-lists/:listID`

##### Description

This endpoint deletes a specific reading list and its books by its ID and returns a confirmation message.

##### Request

The request must include the list ID as a path parameter.

##### Response

The response body contains a json object with a message with the deleted list ID.

##### Status Codes

- `204`: The list was deleted successfully.
- `404`: The list was not found.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X DELETE https://readinglists.onrender.com/reading-lists/66634122-09dd-4ed8-9b14-8483ca06b178
```

```json
{
    "message": "deleted 66634122-09dd-4ed8-9b14-8483ca06b178"
}
```

---

### `GET /reading-lists/:listID`

##### Description

This endpoint returns a specific reading list and its books by its ID.

##### Request

The request must include the list ID as a path parameter.

##### Response

The response body contains a JSON object with the following properties:

- `listName`: The name of the list.
- `books`: An object with the book ISBNs as keys and the book objects as values.

##### Status Codes

- `200`: The list was retrieved successfully.
- `404`: The list was not found.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X GET https://readinglists.onrender.com/reading-lists/6e2053c6-fca1-4d7f-975a-ca29c0e31663
```

```json
{
  "listName": "My Reading List",
  "books": {
    "9780143127550": {
      "isbn": "9780143127550",
      "title": "Sapiens: A Brief History of Humankind",
      "author": "Yuval Noah Harari",
      "status": "In Progress"
    },
    "9780062316097": {
      "isbn": "9780062316097",
      "title": "The Martian",
      "author": "Andy Weir",
      "status": "Unread"
    }
  }
}
```

---

### `PUT /reading-lists/:listID/books`

##### Description

This endpoint adds a book to a specific reading list by its ID.

##### Request

The request must include the list ID as a path parameter and a JSON object with the following property in the body:

- `book`: The book object to be added. It must have the following properties:
  - `isbn`: The ISBN of the book.
  - `title`: The title of the book.
  - `author`: The author of the book.
  - `status`: The reading status of the book. It must be one of the following values: `Unread`, `In Progress`, or `Finished`.
  - `image`: The cover image of the book. (Optional. There is a default if not provided).

##### Response

The response body contains a json object with a message with the added book title, ISBN, and list ID.

##### Status Codes

- `201`: The book was added successfully.
- `400`: The book was not provided or was invalid.
- `404`: The book already exists or the reading list does not exist.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"book\": {\"isbn\": \"9780062316097\", \"title\": \"The Martian\", \"author\": \"Andy Weir\", \"status\": \"Unread\"}}" https://readinglists.onrender.com/reading-lists/6e2053c6-fca1-4d7f-975a-ca29c0e31663/books
```

```json
{
    "message": "Added Book The Martian with ISBN: 9780062316097 to list 6e2053c6-fca1-4d7f-975a-ca29c0e31663"
}
```

---

### `GET /reading-lists/:listID/books/:bookISBN`

##### Description

This endpoint returns a specific book from a specific reading list by its ID and ISBN.

##### Request

The request must include the list ID and the book ISBN as path parameters.

##### Response

The response body contains a JSON object with the following properties:

- `isbn`: The ISBN of the book.
- `title`: The title of the book.
- `author`: The author of the book.
- `status`: The reading status of the book.
- `image`: The cover image of the book.

##### Status Codes

- `200`: The book was retrieved successfully.
- `404`: The book or the list was not found.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X GET https://readinglists.onrender.com/reading-lists/6e2053c6-fca1-4d7f-975a-ca29c0e31663/books/9780062316097
```

```json
{
  "isbn": "9780062316097",
  "title": "The Martian",
  "author": "Andy Weir",
  "status": "Unread"
}
```

---

### `PUT /reading-lists/:listID/books/:isbn`

##### Description

This endpoint updates a specific book from a specific reading list by its ID and ISBN and returns a confirmation message.

##### Request

The request must include the list ID and the book ISBN as path parameters and a JSON object with the following property in the body:

- `book`: The book object to be updated. It must have the following properties:
  - `isbn`: The ISBN of the book.
  - `title`: The title of the book.
  - `author`: The author of the book.
  - `status`: The reading status of the book. It must be one of the following values: `Unread`, `In Progress`, or `Finished`.

##### Response

The response body contains a json object with a message with the updated book ISBN.

##### Status Codes

- `201`: The book was updated successfully.
- `400`: The book was not provided or was invalid.
- `404`: The book or the list does not exist.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X PUT -H "Content-Type: application/json" -d "{\"book\": {\"isbn\": \"9780062316097\", \"title\": \"The Martian\", \"author\": \"Andy Weir\", \"status\": \"Finished\"}}" https://readinglists.onrender.com/reading-lists/6e2053c6-fca1-4d7f-975a-ca29c0e31663/books/9780062316097
```

```json
{
    "message": "Updated Books 9780062316097"
}
```

---

### `DELETE /reading-lists/:listID/books/:bookisbn`

##### Description

This endpoint deletes a specific book from a specific reading list by its ID and ISBN and returns a confirmation message.

##### Request

The request must include the list ID and the book ISBN as path parameters.

##### Response

The response body contains a json object with a message with the deleted list ID.

##### Status Codes

- `204`: The book was deleted successfully.
- `404`: The book or the list was not found.
- `500`: An internal server error occurred.

##### Example

```bash
curl -X DELETE https://readinglists.onrender.com/reading-lists/6e2053c6-fca1-4d7f-975a-ca29c0e31663/books/9780062316097
```

```json
{
    "message": "deleted 6e2053c6-fca1-4d7f-975a-ca29c0e31663"
}
```
