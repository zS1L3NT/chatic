const express = require("express")
const config = require("config")
const path = require("path")
const app = express()
const dbService = require("./database/service")
const cloudinary = require("cloudinary").v2
cloudinary.config({
	cloud_name: config.get("CLOUDINARY_CLOUD_NAME"),
	api_key: config.get("CLOUDINARY_API_KEY"),
	api_secret: config.get("CLOUDINARY_API_SECRET")
})
module.exports.cloudinary = cloudinary
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: "50mb" }))
app.use("/api/account", require("./routes/api/account"))

const http = require("http")
const SocketIo = require("socket.io")
const server = http.createServer(app)
const io = SocketIo(server)

dbService.connect(err => {
	if (err) {
		console.log("Error: ", err)
		process.exit(1)
	}

	if (process.env.NODE_ENV === "production") {
		app.use(
			express.static(path.resolve(__dirname, "..", "client", "build"))
		)
		app.get("*", (_req, res) => {
			res.sendFile(
				path.resolve(__dirname, "..", "client", "build", "index.html")
			)
		})
	}

	// Socket stuff

	require("./sockets")(io)

	server.listen(PORT, () => console.log(`Server started on port ${PORT}\n\n`))
})
