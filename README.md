
# Mohammed Ehab's Reading Lists App

**Description** 

The App Allows you to perform CRUD operations on reading lists and also on books within each reading list.

**Stack Used**
- Redis as a NOSQL Database.
- Express.js Node Backend.
- React Frontend.


**How to Access the APP?**
- Easy Way: Frontend App
	- You can access the app through the UI at [Reading Lists (m-elsaeed.github.io)](https://m-elsaeed.github.io/ReadingLists/)
- Dev Way: Backend
	- You can use postman or any library to call the Backend API Endpoints directly.
	- The API is hosted at [readinglists.onrender.com](https://readinglists.onrender.com/)


## Backend API Endpoints Specs

  

**URL:** '/reading-lists'

**Method:** post

**Description:** Creates a reading List

**Body Schema:**

    {

        name: "Reading List name as a string"

    }

**Important Notes**

- valid JSON with name key required.

  

#

  

**URL:** '/reading-lists'

**Method:** get

**Description:** Gets all reading lists

#

  
  

**URL:** '/reading-lists/:id'

**Method:** get

**Description:** Gets full reading list object by id

  

#

  

**URL:** '/reading-lists'

**Method:** put

**Description:** Updates a reading List Name

**Body Schema:**

    {

        name: "Reading List name as a string"

    }

**Important Notes**

- valid JSON with name key required.

  

#

  

**URL:** '/reading-lists/:id'

**Method:** delete

**Description:** Deletes a reading list by id

  

#

  

  

**URL:** '/reading-lists/:id/books'

**Method:** post

**Description:** Creates book in a reading list

**Body Schema:**

    {

        "book": {

        "isbn": "bookISBN",

        "title": "Book Title",

        "author": "Book Author",

        "status": "Unread",

        "image": "cover image url"

        }

    }

  

**Important Notes:**

- The book object is required along with all its properties except image.
- The status can only be one of three values ['Unread', 'In Progress', 'Finished']

  

  

#

  

  

**URL:** '/reading-lists/:id/books/:ISBN'

**Method:** get

**Description:** Gets book in a reading list by ISBN

  

#

  

  

**URL:** '/reading-lists/:id/books/:ISBN'

**Method:** put

**Description:** Updates a book in a reading list by isbn

**Body Schema:**

    {

        "book": {

        "isbn": "bookISBN",

        "title": "Book Title",

        "author": "Book Author",

        "status": "Unread",

        "image": "cover image url"

        }

    }

  

**Important Notes:**

- Valid JSON is required.
- The book object is required along with all its properties except image.
- The status can only be one of three values ['Unread', 'In Progress', 'Finished']

#

  

**URL:** '/reading-lists/:id/books/:ISBN'

**Method:** delete

**Description:** deletes book in a reading list by ISBN
