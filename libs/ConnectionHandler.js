class ConnectionHandler {
    constructor() {
        this.data = {}
    }

    save(id, conn) {
        if (id in this.data) {
            this.data[id].push(conn)
        } else
            this.data[id] = [conn]
    }
    get(id) {
        return this.data[id] ?? []
    }
    remove(id, conn) {
        if (!(id in this.data))
            return;

        if (!conn)
            delete this.data[id]
        else {
            const index = this.data[id].findIndex(_conn => _conn === conn)
            if (index == -1)
                return;
            this.data[id].splice(index)
            if (this.data[id].length == 0)
                delete this.data[id]
        }
    }

    clear() {
        this.data.keys().forEach(key => delete this.data[key])
    }
}

module.exports = ConnectionHandler