import React, { useState, useEffect } from "react";
import axios from "axios";

// A custom hook to fetch data from a given URL
const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(url);
				setData(response.data);
				setLoading(false);
			} catch (err) {
				setError(err.message);
				setLoading(false);
			}
		};
		fetchData();
	}, [url]);

	return { data, loading, error };
};

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

// A component to display the CRUD app
const App = () => {
	const [lists, setLists] = useState(null);
	const [selectedList, setSelectedList] = useState(null);
	const [error, setError] = useState(null);

	// Fetch the data from the API
	const { data, loading } = useFetch("http://127.0.0.1:3000/reading-lists");

	// Initialize the lists state with the fetched data
	useEffect(() => {
		if (data) {
			setLists(data);
			setSelectedList(Object.keys(data)[0]);
		}
	}, [data]);

	// Handle adding a new book to the selected list
	const handleAddBook = async (listID, isbn, title, author, status) => {
		// Check if the isbn already exists in the list
		console.log(lists)
		console.log(listID)
		if (lists[listID].books[isbn]) {
			setError("The book with this ISBN already exists in the list.");
			return;
		}
		// Create a new book object
		const newBook = {
			isbn,
			title,
			author,
			status,
		};
		// Post the new book to the API

		axios.post(
			`http://127.0.0.1:3000/reading-lists/${listID}/books`,
			{ book: newBook }
		)
			.then((res) => {
				let currLists = lists;
				currLists[listID].books[isbn] = newBook;
				// Update the lists state with the new book
				setLists(currLists);
				setError(null);
			})
			.catch((err) => {
				// Clear the error state
				setError(err.message);
			});
	};

	// Handle deleting a book from the selected list
	const handleDeleteBook = async (isbn) => {
		// Delete the book from the API
		try {
			await axios.delete(
				`http://127.0.0.1:3000/reading-lists/${selectedList}/books/${isbn}`
			);
			// Update the lists state by removing the deleted book
			delete lists[selectedList].books[isbn];
			setLists({ ...lists });
		} catch (err) {
			setError(err.message);
		}
	};

	// Handle updating a book in the selected list
	const handleUpdateBook = async (isbn, title, author, status) => {
		// Update the book in the API
		try {
			let newBook = {
				isbn,
				title,
				author,
				status
			}
			await axios.put(
				`http://127.0.0.1:3000/reading-lists/${selectedList}/books/${isbn}`,
				{
					book: newBook
				}
			);
			lists[selectedList].books[isbn] = newBook;
			setLists({ ...lists });
		} catch (err) {
			setError(err.message);
		}
	};

	// Handle changing the selected list
	const handleChangeList = (e) => {
		const listId = e.target.value;
		setSelectedList(listId);
	};

	return (
		<div className="app">
			{
				loading ? <p>Loading</p> :
					<>
						<h1>My Reading Lists</h1>
						<select onChange={handleChangeList}>
							{lists && Object.keys(lists).map((listKey) => (
								<option key={listKey} value={listKey}>
									{lists[listKey].listName}
								</option>
							))}
						</select>
						{lists && selectedList && (
							<BookList
								list={lists[selectedList]}
								onDelete={handleDeleteBook}
								onUpdate={handleUpdateBook}
							/>
						)}
						{selectedList && <BookForm listID={selectedList} onAdd={handleAddBook} />}
						{error && <p className="error">{error}</p>}
					</>
			}
		</div>
	);
};

export default App;