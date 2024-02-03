import React, { useState, useEffect } from "react";
import { DeleteForever, Edit, AddBox, Clear } from '@mui/icons-material';

// A component to display a form for creating, editing, or deleting a list
export default function ListForm({ lists, selectedListID, onNew, onEdit, onDelete }) {
    const [newListName, setNewListName] = useState("Your new list name");
    const [editedListName, setEditedListName] = useState("Your edited list name");
    const [listFormOpen, setListFormOpen] = useState(false);
    const [newListFormOpen, setNewListFormOpen] = useState(false);

    useEffect(() => {
        if (selectedListID) {
            setEditedListName(lists[selectedListID].listName)
        }
    }, [selectedListID, lists])

    return (
        <>
            {
                !(newListFormOpen || listFormOpen) &&
                <>
                    <label className="title-with-icon button edit-color" onClick={() => { setListFormOpen(true); setNewListFormOpen(false) }}>
                        <Edit fontSize="medium" ></Edit>
                        Edit List
                    </label>
                    <div className="title-with-icon">
                        <label className="title-with-icon button add-color" onClick={() => { setListFormOpen(false); setNewListFormOpen(true) }}>
                            <AddBox fontSize="medium" ></AddBox>
                            New List
                        </label>
                    </div>
                </>
            }
            {listFormOpen && <>
                <form className="title-with-icon" onSubmit={onEdit}>
                    <div className="title-with-icon">

                        <label className="title-with-icon">
                            Edited List Name:
                            <input type="text" name="editedListName" value={editedListName} onChange={e => setEditedListName(e.target.value)} />
                        </label>
                        <label className="title-with-icon button edit-color" type="submit">
                            <Edit fontSize="medium" ></Edit>
                            Confirm Edit
                        </label>
                    </div>
                    <label className="title-with-icon button delete-color" onClick={onDelete} style={{ marginTop: "10px", marginBottom: "10px" }}>
                        {selectedListID && <DeleteForever fontSize="medium" >Delete Selected Reading List</DeleteForever>}
                        Delete List
                    </label>
                </form>
            </>
            }
            {
                newListFormOpen &&
                <div style={{ width: "100%" }}>

                    <form className="title-with-icon" onSubmit={onNew}>
                        <label className="title-with-icon">
                            New List Name:
                            <input type="text" name="newListName" value={newListName} onChange={e => setNewListName(e.target.value)} />
                        </label>
                        <label className="title-with-icon button add-color" type="submit">
                            <AddBox fontSize="medium" ></AddBox>
                            Create a New Reading List
                        </label>
                    </form>
                </div>
            }
            {
                (newListFormOpen || listFormOpen) &&
                < label className="title-with-icon" style={{ marginTop: "10px", marginBottom: "10px" }} onClick={() => { setListFormOpen(false); setNewListFormOpen(false); }} >
                    <Clear fontSize="medium" ></Clear>
                    Close
                </label>
            }
        </>
    );
};
