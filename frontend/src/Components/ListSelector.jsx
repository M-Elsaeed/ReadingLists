// A component to display a dropdown menu of the available lists
export default function ListSelector({ lists, selectedListID, onChange }) {
    return (
        <select onChange={onChange} value={lists ? selectedListID : undefined}>
            {lists && Object.keys(lists).map((listKey) => (
                <option key={listKey} value={listKey}>
                    {lists[listKey].listName}
                </option>
            ))}
        </select>
    );
};