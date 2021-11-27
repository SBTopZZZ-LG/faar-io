// Requires
const net = require('net')
const { v4: uuidv4 } = require("uuid")
const ConnectionHandler = new (require("./ConnectionHandler"))()

// Consts/Vars
const PORT = 3000
var server = net.createServer()

const FEC = new RegExp(/^YES/), SEC = new RegExp(/^NO[ ]*(.+)/), COMM = new RegExp(/^([a-z\-\d]+)[ ]+(.+)/)

// Middleware
server.on('connection', conn => {
    const uuid = uuidv4()
    ConnectionHandler.save(uuid, conn)
    conn.write(uuid)

    conn.on('data', data => {
        const dataStr = data.toString()
        if (FEC.test(dataStr)) {
            // First end client
            conn.write("OK")
        } else if (SEC.test(dataStr)) {
            // Second end client
            ConnectionHandler.remove(uuid)
            const old_uuid = SEC.exec(dataStr)[1]
            var conns = ConnectionHandler.get(old_uuid)
            if (!conns.length || conns.length >= 2)
                return conn.write("FAIL")
            if (conns.findIndex(_conn => _conn === conn) != -1)
                return conn.write("CANNOT CONNECT TO SELF")
            ConnectionHandler.save(old_uuid, conn)
            const conn2 = conns[0]
            conn.write("OK")
            conn2.write("CLIENT CONNECTED")
        } else if (COMM.test(dataStr)) {
            // Communication
            const _data = COMM.exec(dataStr)
            const old_uuid = _data[1], content = _data[2]
            const conns = ConnectionHandler.get(old_uuid)
            var index = conns.findIndex(_conn => _conn === conn)
            if (index == -1)
                return;
            index = !index ? 1 : 0
            const conn2 = conns[index]
            conn2.write("RESPONSE " + content)
            conn.write("OK")
        }
    })

    conn.once('close', err => {
        ConnectionHandler.remove(uuid, conn)
    })

    conn.on('error', err => {
        ConnectionHandler.remove(uuid, conn)
    })
})

server.listen(PORT, function () {
    console.log("Server running on PORT", PORT);
})