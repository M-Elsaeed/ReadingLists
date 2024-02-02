import React, { useState, useEffect } from "react";
import "./styles.css";
import { AddBox } from "@mui/icons-material";

// A component to display a form to add a new book
const BookForm = ({ onAdd, listID }) => {
	const [isbn, setIsbn] = useState("");
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [imageURL, setimageURL] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg");
	const [status, setStatus] = useState("Unread");

	const handleSubmit = (e) => {
		e.preventDefault();
		onAdd(listID, isbn, title, author, status);
		setIsbn("");
		setTitle("");
		setAuthor("");
		setimageURL("https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg");
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
			{/* <h2>Add a new book Manually</h2> */}
			<form className="title-with-icon" onSubmit={handleSubmit}>
				<label htmlFor="isbn">ISBN:
					<input
						type="text"
						id="isbn"
						name="isbn"
						value={isbn}
						onChange={handleChange}
						required
					/>
				</label>
				<label htmlFor="title">Title:
					<input
						type="text"
						id="title"
						name="title"
						value={title}
						onChange={handleChange}
						required
					/>
				</label>
				<label htmlFor="author">Author:
					<input
						type="text"
						id="author"
						name="author"
						value={author}
						onChange={handleChange}
						required
					/>
				</label>
				<label htmlFor="imageURL">Cover URL:
					<input
						type="text"
						id="imageURL"
						name="imageURL"
						value={imageURL}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="status">Status:
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
				</label>
				<label className="title-with-icon" style={{margin: 0}}>
					Add Book
					<AddBox fontSize="large" onClick={handleSubmit} type="submit">Add</AddBox>
				</label>
			</form>
		</div>
	);
};

export default BookForm;