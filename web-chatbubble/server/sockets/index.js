const url = require("config").get([
	process.env.NODE_ENV === "production" ? "onlineMongoURI" : "offlineMongoURI"
])

const getDate = (extra = 0) => {
	var final = ""
	var d = new Date()
	var hour = d.getHours()
	var minutes = d.getMinutes()
	var ampm = "AM"
	var month = d.getMonth()
	var date = d.getDate()
	var seconds = d.getSeconds()

	// Hour config
	if (hour < 10) {
		hour = "0" + hour
	}
	if (hour > 12) {
		hour -= 12
		ampm = "PM"
	}
	final += hour

	// Add ':'
	final += ":"

	// Minute config
	if (minutes < 10) {
		minutes = "0" + minutes
	}
	final += minutes

	// Add ':'
	final += ":"

	// Seconds config
	if (extra !== 0) {
		seconds += extra
	}
	if (seconds < 10) {
		seconds = "0" + seconds
	}
	final += seconds
	if (hour === "12" && minutes === "00" && seconds === "00") {
		ampm = "NN"
	}
	if (hour === "00" && minutes === "00" && seconds === "00") {
		ampm = "MN"
	}

	// Add ampm
	final += " " + ampm

	// Add ' | '
	final += " | "

	// Month Config
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
	final += months[month]

	// Date config
	final += " " + date

	return final
}

module.exports = io => {
	io.on("connection", async socket => {
		require("./online")(socket)
		require("./email")(socket)
		require("./search")(socket)
		require("./chat")(socket)
		require("./friend")(socket)
		require("./group")(socket, getDate)
	})
}
