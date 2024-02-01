import React, { useState, useEffect } from "react";
import Book from './Book.jsx';

// A component to display a list of books
const BookList = ({ list, onDelete, onUpdate }) => {
	return (
		<div className="book-list">
			<h2>{list.listName}</h2>
			{Object.values(list.books).map((book) => (
				<Book
					key={book.isbn}
					book={book}
					onDelete={onDelete}
					onUpdate={onUpdate}
				/>
			))}
		</div>
	);
};

export default BookList;