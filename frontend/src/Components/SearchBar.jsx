import React, { useState, useEffect } from "react";
import axios from "axios";
import "crypto";
import Book from './Book.jsx';

// A custom hook to fetch data from the Open Library API
const useOpenLibrary = (query) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Create a cancel token source
		const source = axios.CancelToken.source();
		// Only fetch data if the query is not empty
		if (query) {
			setLoading(true);
			setError(null);
			axios
				.get(
					`https://openlibrary.org/search.json?q=${query}&offset=0&limit=10&fields=key,title,subtitle,author_name,isbn,cover_i`,
					// Pass the cancel token as an option
					{ cancelToken: source.token }
				)
				.then((response) => {
					// Extract the docs array from the response data
					const docs = response.data.docs;
					// Map each doc to an object with the relevant fields
					const results = docs.map((doc) => ({
						key: doc.key,
						title: doc.title,
						subtitle: doc.subtitle,
						author: doc.author_name ? doc.author_name.join(", ") : "",
						isbn: doc.isbn ? doc.isbn[0] ? doc.isbn[0] : crypto.randomUUID() : crypto.randomUUID(),
						// Use the cover_i field to construct the image URL
						image: doc.cover_i
							? `http://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
							: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
					}));
					setData(results);
					setLoading(false);
				})
				.catch((error) => {
					// If the request was canceled, do not update the state
					if (axios.isCancel(error)) {
						console.log("Request canceled:", error.message);
					} else {
						// Otherwise, handle the error as usual
						setError(error.message);
						setLoading(false);
					}
				});
		} else {
			// If the query is empty, reset the data
			setData([]);
		}
		// Return a cleanup function to cancel the request
		return () => {
			source.cancel("Query changed");
		};
	}, [query]);

	return { data, loading, error };
};


// The main component that renders the search bar and the form
const SearchBar = ({ onAdd, listID }) => {
	const [query, setQuery] = useState(""); // The state for the search query
	const [selected, setSelected] = useState(null); // The state for the selected result
	const { data, loading, error } = useOpenLibrary(query); // The custom hook to fetch data

	// A handler function to update the query state
	const handleQueryChange = (event) => {
		setQuery(event.target.value);
	};

	// A handler function to update the selected state and close the dropdown
	const handleSelect = (result) => {
		setSelected(result);
		console.log(result);
		onAdd(listID, result.isbn, result.title, result.author, "Unread", result.image);
		setQuery("");
		setSelected(null);
	};

	// A handler function to clear the selected state and the form
	const handleClear = () => {
		setQuery("");
		setSelected(null);
	};

	return (
		<div className="search-bar">
			<h2>Search Books to Add Automatically</h2>
			<input
				type="text"
				value={query}
				onChange={handleQueryChange}
				placeholder="Enter a keyword"
			/>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}
			{data.length > 0 && (
				<div className="dropdown" >
					{data.map((result) => (
						<div
							key={result.key}
							className="result"
							onClick={() => handleSelect(result)}
						>
							<Book
								key={result.isbn}
								book={result}
								editableCard={false}
							/>
						</div>
					))}
				</div>
			)}
			<button onClick={handleClear}>Clear</button>
		</div>
	);
};

export default SearchBar;
