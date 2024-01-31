const { randomUUID } = require("crypto")
const IListsTable = require("./IListsTable")

class ListsTable extends IListsTable {
    lists = null

    GetLists() {
        if (this.lists == null) {
            this.lists = fs.existsSync("./BooksDB") ? JSON.parse(fs.readFileSync("./BooksDB")) : {}
        }

        return this.lists
    }

    AddList(list) {
        let newListUUID = randomUUID()
        while (this.lists[newListUUID]) {
            newListUUID = randomUUID()
        }

        this.lists[newListUUID] = list
    }

    RemoveList(listID) {
        this.lists[listID] = null
    }

    EditList(listID, newList) {
        this.lists[listID] = newList
    }

    SaveTablePersistent() {

    }
}