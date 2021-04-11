require("colors")

module.exports = socket => {
	const { Users, NewColl, getTable } = require("../database/utilities")(
		require("../database/service").MongoDB
	)
	socket.on("friend_search_user", async phnm => {
		try {
			let res = await Users.findOne({ phnm })
			if (res)
				socket.emit("friend_found_user", {
					usnm: res.usnm,
					pfp: res.pfp
				})
			else socket.emit("friend_no_user")
			console.log(`Friend search for ${phnm}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("group_search_user", async phnm => {
		try {
			let res = await Users.findOne({ phnm })
			if (res)
				socket.emit("group_found_user", {
					usnm: res.usnm,
					pfp: res.pfp
				})
			else socket.emit("group_no_user")
			console.log(`Group search for ${phnm}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("edit-chat_search_user", async phnm => {
		try {
			let res = await Users.findOne({ phnm })
			if (res)
				socket.emit("edit-chat_found_user", {
					usnm: res.usnm,
					pfp: res.pfp
				})
			else socket.emit("edit-chat_no_user")
			console.log(`Edit Chat search for ${phnm}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("add_friend", async ([cUsnm, oUsnm]) => {
		try {
			let table = await getTable("usnm", cUsnm, "usnm", oUsnm)
			if (table === undefined) {
				await NewColl(`["default","${cUsnm}","${oUsnm}"]`)
				socket.emit("added_friend")
				console.log(`${cUsnm} added ${oUsnm} as a friend`)
			} else socket.emit("already_friend")
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})
}
