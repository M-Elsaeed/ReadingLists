import React, { useState, useEffect } from "react";
import axios from "axios";
import BookList from "./Components/BookList.jsx";
import BookForm from "./Components/BookForm.jsx";
import SearchBar from "./Components/SearchBar.jsx";
import { DeleteForever, Edit, AddBox, ExpandMore, ExpandLess, Clear } from '@mui/icons-material';

const ListsAPIEndpoint = import.meta.env.DEV ? "http://127.0.0.1:3000" : "https://readinglists.onrender.com";
console.log(ListsAPIEndpoint)

// A custom hook to fetch data from a given URL
const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			const response = await axios.get(url);
			setData(response.data);
			setLoading(false);
		} catch (err) {
			setError(err.response?.data?.message ? err.response.data.message : err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [url]);

	return { data, loading, error };
};


// A component to display the CRUD app
const App = () => {
	const [lists, setLists] = useState(null);
	const [selectedListID, setSelectedListID] = useState(null);
	const [error, setError] = useState(null);
	const [newListName, setNewListName] = useState("");
	const [editedListName, setEditedListName] = useState("Your edited list name");
	const [listFormOpen, setListFormOpen] = useState(false);
	const [manualFormOpen, setManualFormOpen] = useState(false);
	const [newListFormOpen, setNewListFormOpen] = useState(false);


	// Fetch the data from the API
	const { data, loading } = useFetch(`${ListsAPIEndpoint}/reading-lists-info`);

	useEffect(() => {
		if (selectedListID) {
			setEditedListName(lists[selectedListID].listName)
			axios.get(`${ListsAPIEndpoint}/reading-lists/${selectedListID}`)
				.then((res) => {
					lists[selectedListID] = res.data
					setLists({ ...lists })
				})
				.catch((err) => {
					setError(err.response?.data?.message ? err.response.data.message : err.message)
				})
		}
	}, [selectedListID])
	// Initialize the lists state with the fetched data
	useEffect(() => {
		if (data) {
			setLists(data);
			setSelectedListID(Object.keys(data)[0]);
		}
	}, [data]);

	// Handle adding a new book to the selected list
	const handleAddBook = async (listID, isbn, title, author, status, image) => {
		// Check if the isbn already exists in the list
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
			`${ListsAPIEndpoint}/reading-lists/${listID}/books`,
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
				setError(err.response?.data?.message ? err.response.data.message : err.message);
			});
	};

	// Handle deleting a book from the selected list
	const handleDeleteBook = async (isbn) => {
		// Delete the book from the API
		try {
			await axios.delete(
				`${ListsAPIEndpoint}/reading-lists/${selectedListID}/books/${isbn}`
			);
			// Update the lists state by removing the deleted book
			delete lists[selectedListID].books[isbn];
			setLists({ ...lists });
		} catch (err) {
			setError(err.response?.data?.message ? err.response.data.message : err.message);
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
				`${ListsAPIEndpoint}/reading-lists/${selectedListID}/books/${isbn}`,
				{
					book: newBook
				}
			);

			lists[selectedListID].books[isbn] = newBook;
			setLists({ ...lists });
		} catch (err) {
			setError(err.response?.data?.message ? err.response.data.message : err.message);
		}
	};

	// Handle changing the selected list
	const handleChangeList = (e) => {
		e.preventDefault();
		const listId = e.target.value;
		setSelectedListID(listId);
	};

	// Handle deleting the selected list
	const handleDeleteList = (e) => {
		e.preventDefault();
		if (confirm("Are you sure you want to delete this list?")) {
			axios.delete(`${ListsAPIEndpoint}/reading-lists/${selectedListID}`)
				.then((res) => {
					delete lists[selectedListID]
					setLists({ ...lists })
					setSelectedListID(Object.keys(lists)[0])
					setError(null)
					setListFormOpen(false)
				})
				.catch((err) => {
					setError(err.response?.data?.message ? err.response.data.message : err.message)
				})
		}
	};

	const handleNewList = (e) => {
		e.preventDefault();
		axios.post(`${ListsAPIEndpoint}/reading-lists/`, { listName: newListName })
			.then((res) => {
				lists[res.data.listID] = { listName: res.data.listName, books: {} }
				setLists({ ...lists })
				setSelectedListID(res.data.listID)
				setError(null)
				setNewListFormOpen(false)
			})
			.catch((err) => {
				setError(err.response?.data?.message ? err.response.data.message : err.message)
			})
	}

	const handleEditList = (e) => {
		e.preventDefault();
		axios.put(`${ListsAPIEndpoint}/reading-lists/${selectedListID}`, { listName: editedListName })
			.then((res) => {
				lists[selectedListID].listName = editedListName
				setLists({ ...lists })
				setSelectedListID(res.data.listID)
				setError(null)
				setListFormOpen(false)
			})
			.catch((err) => {
				setError(err.response?.data?.message ? err.response.data.message : err.message)
			})
	}

	return (
		<div className="app">
			{
				loading ? <p>Loading</p> :
					<>
						<h1>My Reading Lists</h1>
						<hr />
						<div>
							{/* List Selector */}
							<div className="title-with-icon-nowrap">

								<h4>Current List:</h4>
								<select onChange={handleChangeList} value={lists ? selectedListID : undefined}>
									{lists && Object.keys(lists).map((listKey) => (
										<option key={listKey} value={listKey}>
											{lists[listKey].listName}
										</option>
									))}
								</select>
								{
									!(newListFormOpen || listFormOpen) &&
									<label className="title-with-icon button edit-color" onClick={() => { setListFormOpen(true); setNewListFormOpen(false) }}>
										<Edit fontSize="medium" ></Edit>
										Edit List
									</label>
								}
								{/* Edit List Form with its toggle */}
								{listFormOpen &&
									<form className="title-with-icon" onSubmit={handleEditList}>
										<div className="title-with-icon">

											<label className="title-with-icon">
												Edited List Name:
												<input type="text" value={editedListName} onChange={e => setEditedListName(e.target.value)} placeholder="Enter Edited List Name" />
											</label>
											<label className="title-with-icon button edit-color" onClick={handleEditList}>
												<Edit fontSize="medium" ></Edit>
												Confirm Edit
											</label>
										</div>
										<label className="title-with-icon button delete-color" onClick={handleDeleteList}>
											{selectedListID && <DeleteForever fontSize="medium" >Delete Selected Reading List</DeleteForever>}
											Delete List
										</label>
										< label className="title-with-icon" onClick={() => { setListFormOpen(false); setNewListFormOpen(false); }}>
											<Clear fontSize="medium" ></Clear>
											Close
										</label>
									</form>
								}
							</div>
							<div>


								{/* NEW List Form with its toggle */}
								{
									!(newListFormOpen || listFormOpen) &&
									<div >
										<label className="title-with-icon button add-color" onClick={() => { setListFormOpen(false); setNewListFormOpen(true) }}>
											<AddBox fontSize="medium" ></AddBox>
											New List
										</label>
									</div>
								}
								{
									newListFormOpen &&
									<div >
										<form className="title-with-icon" onSubmit={handleNewList}>
											<label className="title-with-icon">
												New List Name:
												<input type="text" placeholder="Enter New List Name Here" value={newListName} onChange={e => setNewListName(e.target.value)} />
											</label>
											<label className="title-with-icon button add-color" onClick={handleNewList}>
												<AddBox fontSize="medium" ></AddBox>
												Create a New Reading List
											</label>
											< label className="title-with-icon" onClick={() => { setNewListFormOpen(false); }}>
												<Clear fontSize="medium" ></Clear>
												Close
											</label>
										</form>
									</div>
								}
							</div>
						</div>

						<hr />

						{error && <p className="error">{error}</p>}

						{lists && selectedListID && lists[selectedListID] && (
							<>
								<h2>{lists[selectedListID].listName}</h2>
								<SearchBar listID={selectedListID} onAdd={handleAddBook}></SearchBar>
								<div className="title-with-icon" onClick={() => { setManualFormOpen(!manualFormOpen) }}>
									<h4>(Alternative) Add Book Details Manually</h4>
									{
										manualFormOpen ?
											<ExpandLess fontSize="medium"></ExpandLess>
											:
											<ExpandMore fontSize="medium"></ExpandMore>
									}
								</div>
								{manualFormOpen && <BookForm listID={selectedListID} onAdd={handleAddBook} />}
								<BookList
									list={lists[selectedListID]}
									onDelete={handleDeleteBook}
									onUpdate={handleUpdateBook}
								/>
							</>
						)}
					</>
			}
		</div >
	);
};

export default App;