Mathod: post
URL:'/reading-lists'
Description: Creates a reading List
Body Schema: {}

Mathod: get
URL:'/reading-lists'
Description: Gets all reading lists

Mathod: get
URL:'/reading-lists/:id'
Description: Gets reading list by id

Mathod: put
URL:'/reading-lists/:id'
Description: Updates a reading list
Body Schema: {}

Mathod: delete
URL:'/reading-lists/:id'
Description: Deletes a reading list

Mathod: post
URL:'/reading-lists/:id/books'
Description: Creates book in a reading list
Body Schema: {}

Mathod: get
URL:'/reading-lists/:id/books'
Description: Gets all books in a reading list

Mathod: get
URL:'/reading-lists/:id/books/:ISBN'
Description: Gets book in a reading list by ISBN

Mathod: put
URL:'/reading-lists/:id/books/:ISBN'
Description: Updates a book in a reading list by isbn
Body Schema: {}