require("colors")
const online = require("../global/online")

module.exports = socket => {
	setInterval(_ => {
		socket.broadcast.emit("res_online", online.all)
	}, 2000)

	socket.on("disconnect", _ => {
		socket.broadcast.emit("reset_online")
		console.log(`&&&&& RESET Online &&&&&`.bgRed)
		online.clear()
	})

	socket.on("logout", _ => {
		socket.broadcast.emit("reset_online")
		console.log(`&&&&& RESET Online &&&&&`.bgRed)
		online.clear()
	})

	socket.on("set_online", user => {
		if (user !== "" && online.all.indexOf(user) < 0) {
			online.set(user)
			console.log(`&&&&& ${user} Online &&&&&`.bgGreen)
		}
	})
}
