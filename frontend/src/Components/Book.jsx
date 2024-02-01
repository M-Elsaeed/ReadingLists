import React, { useState, useEffect } from "react";

// A component to display a single book
const Book = ({ book, onDelete, onUpdate }) => {
	const [editMode, setEditMode] = useState(false);
	const [newTitle, setNewTitle] = useState(book.title);
	const [newAuthor, setNewAuthor] = useState(book.author);
	const [newStatus, setNewStatus] = useState(book.status);

	const handleDelete = () => {
		onDelete(book.isbn);
	};

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleSave = () => {
		onUpdate(book.isbn, newTitle, newAuthor, newStatus);
		setEditMode(false);
	};

	const handleCancel = () => {
		setEditMode(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "title") {
			setNewTitle(value);
		} else if (name === "author") {
			setNewAuthor(value);
		} else if (name === "status") {
			setNewStatus(value);
		}
	};

	return (
		<div className="book">
			{editMode ? (
				<div className="book-edit">
					<input
						type="text"
						name="title"
						value={newTitle}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="author"
						value={newAuthor}
						onChange={handleChange}
					/>
					<select name="status" value={newStatus} onChange={handleChange}>
						<option value="Unread">Unread</option>
						<option value="In Progress">In Progress</option>
						<option value="Finished">Finished</option>
					</select>
					<button onClick={handleSave}>Save</button>
					<button onClick={handleCancel}>Cancel</button>
				</div>
			) : (
				<div className="book-info">
					<p>{book.title}</p>
					<p>{book.author}</p>
					<p>{book.status}</p>
					<button onClick={handleEdit}>Edit</button>
					<button onClick={handleDelete}>Delete</button>
				</div>
			)}
		</div>
	);
};

export default Book;