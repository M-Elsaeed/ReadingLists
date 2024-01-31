import React, { useState } from "react";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { BookList } from "./BookList";
import AddCircleIcon from '@mui/icons-material/AddCircle';

// A custom styled component for the modal content
const ModalContent = styled("div")(({ theme }) => ({
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	maxWidth: "80%",
	backgroundColor: "#f6eee3",
	borderRadius: "10px",
	padding: "10px",
}));

// A custom hook to manage the form state
const useForm = (initialValues) => {
	const [values, setValues] = useState(initialValues);

	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name, value)
		setValues({
			...values,
			[name]: value,
		});
	};

	const resetForm = () => {
		setValues(initialValues);
	};

	return [values, handleChange, resetForm];
};

// The main component for the Reading List
export const ReadingList = ({ ListName }) => {
	if (!ListName) ListName = "A"
	// The state for the books array
	const [books, setBooks] = useState([]);

	// The state for the modal visibility
	const [open, setOpen] = useState(false);

	// The state for the form values
	const [values, handleChange, resetForm] = useForm({
		isbn: "",
		author: "",
		title: "",
		status: "Unread",
	});

	// The handler for adding a new book
	const handleAddBook = () => {
		// Validate the form inputs
		if (!values.isbn || !values.author || !values.title) {
			alert("Please fill in all the fields");
			return;
		}

		// Check if the book already exists
		if (books.some((book) => book.isbn === values.isbn)) {
			alert("This book already exists in the list");
			return;
		}

		// Add the new book to the books array
		setBooks([...books, values]);

		// Close the modal and reset the form
		handleClose();
		resetForm();
	};

	// The handler for opening the modal
	const handleOpen = () => {
		setOpen(true);
	};

	// The handler for closing the modal
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div style={{ display: "flex", flexDirection:"column", maxWidth:"80%"}}>
			<div style={{ display: "flex", justifyContent: "space-between"}} >
				<Typography variant="h4" align="center" gutterBottom marginRight={5}>
					Reading List {ListName}
				</Typography>
				<Button variant="contained" color="primary" onClick={handleOpen}>
					<AddCircleIcon></AddCircleIcon>
				</Button>
			</div>
			<BookList books={books} />
			<Modal open={open} onClose={handleClose}>
				<ModalContent>
					<Typography variant="h5" component="h2">
					</Typography>
					<form>
						<TextField
							label="ISBN"
							name="isbn"
							value={values.isbn}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Author"
							name="author"
							value={values.author}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Title"
							name="title"
							value={values.title}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Status"
							name="status"
							value={values.status}
							onChange={handleChange}
							select
							fullWidth
							margin="normal"
							SelectProps={{
								native: true,
							}}
						>
							<option value="Unread">Unread</option>
							<option value="In progress">In progress</option>
							<option value="Finished">Finished</option>
						</TextField>
						<Button
							variant="contained"
							onClick={handleAddBook}
							fullWidth
						>
							Add
						</Button>
					</form>
				</ModalContent>
			</Modal>
		</div>
	);
};
