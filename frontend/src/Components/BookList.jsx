import React, { useState, useEffect } from "react";
import Book from './Book.jsx';

// A component to display a list of books
const BookList = ({ list, onDelete, onUpdate }) => {
	return (
		<div className="book-list">
			{list.books ? Object.values(list.books).map((book) => (
				<Book
					key={book.isbn}
					book={book}
					onDelete={onDelete}
					onUpdate={onUpdate}
					editableCard={true}
				/>
			)) : <div>No Books Added</div>}
		</div>

	);
};

export default BookList;