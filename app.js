// Requires
require("dotenv").config()
const Ngrok = require("./libs/Ngrok")
require("./libs/TcpServer")

// Express Middleware
const express = require("express")
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Express server running on PORT", PORT)
})

app.get("/", async (req, res, next) => {
    return res.status(200).send(Ngrok.link)
})