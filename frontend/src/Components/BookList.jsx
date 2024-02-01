import React, { useState, useEffect } from "react";
import Book from './Book.jsx';
import "./styles.css";

// A component to display a list of books
const BookList = ({ list, onDelete, onUpdate }) => {
	return (
		<>
			<h2>{list.listName}</h2>
			<div className="book-list">
				{Object.values(list.books).map((book) => (
					<Book
						key={book.isbn}
						book={book}
						onDelete={onDelete}
						onUpdate={onUpdate}
						editableCard={true}
					/>
				))}
			</div>
		</>
	);
};

export default BookList;