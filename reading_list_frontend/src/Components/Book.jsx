import React, { useState } from "react";
import { Edit, DeleteForever, Clear, Save } from "@mui/icons-material";

// A component to display a single book
const Book = ({ book, onDelete, onUpdate, editableCard }) => {

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

	const handleSave = (e) => {
		e.preventDefault();
		onUpdate(book.isbn, newTitle, newAuthor, newStatus, book.image);
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
				<div className="book-info-card">
					<div>
						<img height="200vh" width="150vw" src={book.image ? book.image : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}></img>
					</div>
					<>
						<div >
							<hr />
						</div>
						<div className="space-between-flex">
							<label className="title-with-icon button add-color" onClick={handleSave}>
								<Save fontSize="medium"></Save>Save</label>
							<label className="title-with-icon button delete-color" onClick={handleCancel}>
								<Clear fontSize="medium"></Clear>Cancel
							</label>
						</div>
						<div >
							<hr />
						</div>
					</>
					<form onSubmit={handleSave}>
						<div>
							<label><b>Title: </b>
								<input
									type="text"
									name="title"
									value={newTitle}
									onChange={handleChange}
								/>
							</label>
						</div>
						<div>
							<label><b>Author: </b></label>
							<input
								type="text"
								name="author"
								value={newAuthor}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label><b>Status: </b></label>
							<select name="status" value={newStatus} onChange={handleChange}>
								<option value="Unread">Unread</option>
								<option value="In Progress">In Progress</option>
								<option value="Finished">Finished</option>
							</select>
						</div>
					</form>
				</div>
			) : (
				<div className={editableCard ? "book-info-card" : "book-info-card-small"} >
					<div>
						<img height={editableCard ? "200vh" : "50vh"} width={editableCard ? "150vw" : "30vh"} src={book.image ? book.image : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}></img>
					</div>

					{editableCard &&
						<>
							<div >
								<hr />
							</div>
							<div className="space-between-flex">
								<label className="title-with-icon button edit-color" onClick={handleEdit}>
									<Edit fontSize="medium">
									</Edit>
									Edit
								</label>
								<label className="title-with-icon button delete-color" onClick={handleDelete}>
									<DeleteForever fontSize="medium"></DeleteForever>
									Delete
								</label>
							</div>
							<div >
								<hr />
							</div>
						</>
					}
					<div >
						<p>{editableCard && <b>Title:</b>} {book.title}</p>
						<p>{editableCard && <b>Author:</b>} {book.author}</p>
						{editableCard && <p><b>Status:</b> {book.status}</p>}
					</div>

				</div>
			)}
		</div>
	);
};

export default Book;