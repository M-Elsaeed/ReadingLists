import React, { useState, useEffect } from "react";
import { Box, InputBase, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
const getLongestString = (arr) => {
	// consider only numeric strings
	if (!arr) return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
	arr = arr?.filter((item) => !isNaN(item))
	const ret = arr?.reduce((a, b) => a.length > b.length ? a : b, '')
	console.log(ret)
	return ret
 }
const getImageLink = (isbnArr) => { 
	return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
}
const SearchBox = () => {
	const [query, setQuery] = useState(""); // the user input
	const [results, setResults] = useState([]); // the search results
	const [loading, setLoading] = useState(false); // the loading state
	const [error, setError] = useState(null); // the error state

	// a function to fetch data from the API
	const fetchData = async (query) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(
				`https://openlibrary.org/search.json?q=${query}&offset=0&limit=10&fields=title,subtitle,author_name,isbn,olid`
			);
			console.log(response.data.docs)
			setResults(response.data.docs.slice(0, 10)); // get the first 10 results
		} catch (err) {
			setError(err.message);
		}
		setLoading(false);
	};

	// a function to handle the input change
	const handleChange = (e) => {
		setQuery(e.target.value);
	};

	// a function to debounce the API call
	const debounce = (func, delay) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func(...args);
			}, delay);
		};
	};

	// a debounced version of fetchData
	const debouncedFetchData = debounce(fetchData, 2000);

	// an effect to call the API when the query changes and is unchanged for 2 seconds
	useEffect(() => {
		if (query) {
			debouncedFetchData(query);
		} else {
			setResults([]);
		}
	}, [query]);

	return (
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				margin: "auto",
				width: "80%",
				maxWidth: 600,
				height: 64,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 10,
			}}
		>
			<Paper
				sx={{
					width: "100%",
					height: "100%",
					padding: "0 16px",
					display: "flex",
					alignItems: "center",
				}}
			>
				<SearchIcon />
				<InputBase
					sx={{ ml: 1, flex: 1 }}
					placeholder="Search books..."
					value={query}
					onChange={handleChange}
				/>
			</Paper>
			{!loading && !error && results.length > 0 && (
				<Paper
					sx={{
						position: "absolute",
						top: 64,
						width: "100%",
						maxHeight: 400,
						overflowY: "auto",
					}}
				>
					{results.map((result, keyIndex) => (
						<Box
							key={keyIndex}
							sx={{
								padding: "8px 16px",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<img style={{width:"50px", height:"50px"}} src={getImageLink(getLongestString(result.isbn))} alt={result?.title} />
							<Typography variant="h6">{result?.title}</Typography>
							<Typography variant="subtitle2">
								{result?.author_name}
							</Typography>
						</Box>
					))}
				</Paper>
			)}
			{loading && (
				<Typography sx={{ position: "absolute", top: 64, left: 16 }}>
					Loading...
				</Typography>
			)}
			{error && (
				<Typography sx={{ position: "absolute", top: 64, left: 16, color: "red" }}>
					{error}
				</Typography>
			)}
		</Box>
	);
};

export default SearchBox;
