import React, { useState, useEffect } from "react";

// A component to display a form to add a new book
const BookForm = ({ onAdd, listID }) => {
	const [isbn, setIsbn] = useState("");
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [status, setStatus] = useState("Unread");

	const handleSubmit = (e) => {
		e.preventDefault();
		onAdd(listID, isbn, title, author, status);
		setIsbn("");
		setTitle("");
		setAuthor("");
		setStatus("Unread");
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "isbn") {
			setIsbn(value);
		} else if (name === "title") {
			setTitle(value);
		} else if (name === "author") {
			setAuthor(value);
		} else if (name === "status") {
			setStatus(value);
		}
	};

	return (
		<div className="book-form">
			<h2>Add a new book</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="isbn">ISBN:</label>
				<input
					type="text"
					id="isbn"
					name="isbn"
					value={isbn}
					onChange={handleChange}
					required
				/>
				<label htmlFor="title">Title:</label>
				<input
					type="text"
					id="title"
					name="title"
					value={title}
					onChange={handleChange}
					required
				/>
				<label htmlFor="author">Author:</label>
				<input
					type="text"
					id="author"
					name="author"
					value={author}
					onChange={handleChange}
					required
				/>
				<label htmlFor="status">Status:</label>
				<select
					id="status"
					name="status"
					value={status}
					onChange={handleChange}
					required
				>
					<option value="Unread">Unread</option>
					<option value="In Progress">In Progress</option>
					<option value="Finished">Finished</option>
				</select>
				<button type="submit">Add</button>
			</form>
		</div>
	);
};

export default BookForm;