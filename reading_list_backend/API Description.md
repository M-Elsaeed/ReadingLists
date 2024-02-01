Method: post
URL:'/reading-lists'
Description: Creates a reading List
Body Schema: {}

Method: get
URL:'/reading-lists'
Description: Gets all reading lists

Method: get
URL:'/reading-lists/:id'
Description: Gets reading list by id

Method: delete
URL:'/reading-lists/:id'
Description: Deletes a reading list

Method: post
URL:'/reading-lists/:id/books'
Description: Creates book in a reading list
Body Schema: {}

Method: get
URL:'/reading-lists/:id/books/:ISBN'
Description: Gets book in a reading list by ISBN

Method: put
URL:'/reading-lists/:id/books/:ISBN'
Description: Updates a book in a reading list by isbn
Body Schema: {}

Method: delete
URL:'/reading-lists/:id/books/:ISBN'
Description: deletes book in a reading list by ISBN