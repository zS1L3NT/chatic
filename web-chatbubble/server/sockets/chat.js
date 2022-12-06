require("colors")

module.exports = socket => {
	const {
		Users,
		Groups,
		AllCollections,
		Coll,
		getTable
	} = require("../database/utilities")(require("../database/service").MongoDB)
	socket.on("req_chat-list", async cUsnm => {
		try {
			let result = await AllCollections
			var chatList = []
			var chatUsnms = []
			var groupList = []
			for (let i = 0; i < result.length; i++) {
				const table = result[i]
				if (table.name.indexOf(cUsnm) > 1) {
					if (JSON.parse(table.name)[0] === "default") {
						chatList.push(table.name)
						chatUsnms.push(
							table.name
								.replace("[", "")
								.replace("]", "")
								.replace("default", "")
								.replace(cUsnm, "")
								.split(",")
								.join("")
								.split('"')
								.join("")
						)
					} else if (JSON.parse(table.name).indexOf(cUsnm) >= 0) {
						groupList.push(table.name)
					}
				}
			}
			var chatsData = {}
			if (JSON.stringify(chatList) !== "[]") {
				for (const usnm of chatUsnms) {
					let res = await Users.findOne({ usnm })
					let table = await getTable("usnm", cUsnm, "usnm", usnm)
					let unread = await Coll(table)
						.find({ status: "recieved", sender: res.usnm })
						.toArray()
					chatsData = {
						...chatsData,
						[res.usnm]: {
							data: res.phnm,
							typing: false,
							pfp: res.pfp,
							unread: unread.length,
							blocked: res.blockedBy.indexOf(cUsnm) >= 0
						}
					}
				}
			}
			if (JSON.stringify(groupList) !== "[]") {
				for (const group of groupList) {
					const parse = JSON.parse(group)
					let members = {}
					for (let i = 1; i < parse.length; i++) {
						let user
						if (!parse[i].match(/^\{/))
							user = await Users.findOne({ usnm: parse[i] })
						else
							user = await Users.findOne({
								usnm: parse[i].slice(1, -1)
							})
						members[parse[i]] = user ? user.pfp : "ChatBot"
					}
					let groupdata = await Groups.findOne({ name: parse[0] })
					chatsData = {
						[`[${parse[0]}]`]: {
							typing: false,
							unread: 0,
							icon: groupdata.icon,
							members
						},
						...chatsData
					}
				}
			}
			socket.emit("res_chat-list", chatsData)
			console.log(`Sent ${cUsnm} their chat-list`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("bc-req user-recieved", async usnm => {
		try {
			var chatLists = []
			let collections = await AllCollections
			for (const collectionData of collections) {
				if (
					collectionData.name.indexOf(usnm) > 0 &&
					JSON.parse(collectionData.name).length === 3
				) {
					chatLists.push(collectionData.name)
				}
			}

			var messages = []
			for (const collection of chatLists) {
				let data = await Coll(collection).find().toArray()
				for (let i = 0; i < data.length; i++) {
					const msg = data[i]
					if (msg.sender !== usnm && msg.status === "sent")
						messages.push(msg)
				}
			}

			for (const msg of messages) {
				let table = await getTable("usnm", msg.sender, "usnm", usnm)
				await Coll(table).updateOne(
					{ date: msg.date },
					{ $set: { status: "recieved" } }
				)
			}
			socket.broadcast.emit("bc-res user-recieved", usnm)
			console.log(`${usnm} recieved all messages`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_save-msg", async ({ msg, date, sender, chat }) => {
		try {
			let table
			if (chat.match(/^\[/)) table = await getTable("group", chat)
			else table = await getTable("usnm", sender, "usnm", chat)
			let old = await Coll(table).findOne({ date })
			if (msg !== old.msg) {
				await Coll(table).updateOne(
					{ date },
					{ $set: { text: msg, edited: old.edited + 1 } }
				)
			}
			socket.emit("res_save-msg")
			console.log(`${sender} edited a message`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_delete-msg", async ({ date, sender, chat }) => {
		try {
			let table
			if (chat.match(/^\[/)) table = await getTable("group", chat)
			else table = await getTable("usnm", sender, "usnm", chat)
			await Coll(table).updateOne({ date }, { $set: { text: null } })
			socket.emit("res_delete-msg")
			console.log(`${sender} deleted a message`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("bc-req refresh-auth", _ => {
		socket.broadcast.emit("bc-res refresh-auth")
	})

	socket.on("bc-req refresh-list", _ => {
		socket.broadcast.emit("bc-res refresh-list")
	})

	socket.on("bc-req type-status", data => {
		socket.broadcast.emit("bc-res type-status", data)
	})
}
