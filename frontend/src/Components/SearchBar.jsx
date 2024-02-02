import React, { useState } from "react";
import useOpenLibrary from "./hooks/useOpenLibrary.js";
import "crypto";
import Book from './Book.jsx';

// The main component that renders the search bar and the form
const SearchBar = ({ onAdd, listID }) => {
	const [query, setQuery] = useState(""); // The state for the search query
	const { data, loading, error } = useOpenLibrary(query); // The custom hook to fetch data

	// A handler function to update the query state
	const handleQueryChange = (event) => {
		setQuery(event.target.value);
	};

	// A handler function to update the selected state and close the dropdown
	const handleSelect = (result) => {
		onAdd(listID, result.isbn, result.title, result.author, "Unread", result.image);
		setQuery("");
	};

	// A handler function to clear the selected state and the form
	const handleClear = () => {
		setQuery("");
	};

	return (
		<div className="title-with-icon">
			<h3>Add Books Automatically by Search: </h3>
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
