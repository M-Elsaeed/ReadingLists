import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';

const getBookCoverLink = (isbn) => { return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" }
// The component for the BookList
export const BookList = ({ books }) => {
	return (
		<TableContainer component={Paper} margin="normal">
			<Table style={{maxWidth: "80%"}}>
				<TableHead>
					<TableRow style={{background: "Green", color: "white"}}>
						<TableCell>Book Cover</TableCell>
						<TableCell>ISBN</TableCell>
						<TableCell>Author</TableCell>
						<TableCell>Title</TableCell>
						<TableCell>Status</TableCell>
						<TableCell><div>
							Edit <CreateIcon></CreateIcon></div></TableCell>
						<TableCell><div>Delete <DeleteIcon></DeleteIcon></div></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{books.map((book) => (
						<TableRow key={book.isbn}>
							<img style={{ width: "50px", height: "50px" }} src={getBookCoverLink()} />
							<TableCell>{book.isbn}</TableCell>
							<TableCell>{book.author}</TableCell>
							<TableCell>{book.title}</TableCell>
							<TableCell>{book.status}</TableCell>
							<TableCell><div>
								Edit <CreateIcon></CreateIcon></div></TableCell>
							<TableCell><div>Delete <DeleteIcon></DeleteIcon></div></TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
