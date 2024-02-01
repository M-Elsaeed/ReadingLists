import React, { useState, useEffect } from "react";
import axios from "axios";
import BookList from "./Components/BookList.jsx";
import BookForm from "./Components/BookForm.jsx";
import SearchBar from "./Components/SearchBar.jsx";

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


// A component to display the CRUD app
const App = () => {
	const [lists, setLists] = useState(null);
	const [selectedList, setSelectedList] = useState(null);
	const [error, setError] = useState(null);
	const [newListName, setNewListName] = useState("Your new list name");
	const [editedListName, setEditedListName] = useState("Your edited list name");
	const [editedListNameMode, setEditListNameMode] = useState(false);


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
	const handleAddBook = async (listID, isbn, title, author, status, image) => {
		// Check if the isbn already exists in the list
		console.log(lists)
		console.log(listID)
		if (lists[listID].books[isbn]) {
			setError("The book with this ISBN already exists in the list.");
			return;
		}
		if (!image) image = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
		// Create a new book object
		const newBook = {
			isbn,
			title,
			author,
			status,
			image
		};
		// Post the new book to the API

		axios.post(
			`http://127.0.0.1:3000/reading-lists/${listID}/books`,
			{ book: newBook }
		)
			.then((res) => {
				lists[listID].books[isbn] = newBook;
				// Update the lists state with the new book
				setLists({ ...lists });
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
	const handleUpdateBook = async (isbn, title, author, status, image) => {
		// Update the book in the API
		try {
			let newBook = {
				isbn,
				title,
				author,
				status,
				image
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
		e.preventDefault();
		const listId = e.target.value;
		setSelectedList(listId);
	};

	// Handle changing the selected list
	const handleDeleteList = (e) => {
		e.preventDefault();
		if (confirm("Are you sure you want to delete this list?")) {
			axios.delete(`http://127.0.0.1:3000/reading-lists/${selectedList}`)
				.then((res) => {
					setSelectedList(null)
					setError(null)
				})
				.catch((err) => {
					setError(err.message)
				})
		}
	};

	const handleNewList = (e) => {
		e.preventDefault();
		axios.post(`http://127.0.0.1:3000/reading-lists/`, { name: newListName })
			.then((res) => {
				setSelectedList(res.data.id)
				setError(null)
			})
			.catch((err) => {
				setError(err.message)
			})
	}

	const handleEditList = (e) => {
		e.preventDefault();
		axios.put(`http://127.0.0.1:3000/reading-lists/${selectedList}`, { name: editedListName })
			.then((res) => {
				setSelectedList(res.data.id)
				setError(null)
			})
			.catch((err) => {
				setError(err.message)
			})
	}

	const handeToggleEditMode = (e) => {
		e.preventDefault()
		setEditListNameMode(!editedListNameMode)
	}

	return (
		<div className="app">
			{
				loading ? <p>Loading</p> :
					<>
						<h1>My Reading Lists</h1>
						<div>
							<label>
								Selected Reading List:
								<select onChange={handleChangeList}>
									{lists && Object.keys(lists).map((listKey) => (
										<option key={listKey} value={listKey}>
											{lists[listKey].listName}
										</option>
									))}
								</select>
							</label>
							{editedListNameMode &&
								<form>
									<label>
										Edited List Name:
										<input type="text" value={editedListName} onChange={e => setEditedListName(e.target.value)} />
									</label>
									<button onClick={handleEditList}>Confirm Edit</button>
								</form>
							}
							{selectedList && <button onClick={handeToggleEditMode}>Edit Selected Reading List Name</button>}
							{selectedList && <button onClick={handleDeleteList}>Delete Selected Reading List</button>}
							<form>
								<label>
									New List Name:
									<input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} />
								</label>
								<button onClick={handleNewList}>Create a New Reading List</button>
							</form>
						</div>
						{selectedList && <SearchBar listID={selectedList} onAdd={handleAddBook}></SearchBar>}
						{selectedList && <BookForm listID={selectedList} onAdd={handleAddBook} />}
						{error && <p className="error">{error}</p>}
						{lists && selectedList && lists[selectedList] && (
							<BookList
								list={lists[selectedList]}
								onDelete={handleDeleteBook}
								onUpdate={handleUpdateBook}
							/>
						)}
					</>
			}
		</div>
	);
};

export default App;