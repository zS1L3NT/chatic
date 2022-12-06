require("colors")

module.exports = socket => {
	const { Users, Coll, getTable } = require("../database/utilities")(
		require("../database/service").MongoDB
	)
	socket.on("send-chat", async ({ sender, reciever, text, date }) => {
		try {
			let table = await getTable("usnm", sender, "usnm", reciever)
			let { blockedBy } = await Users.findOne({ usnm: sender })
			var insertData = {
				sender,
				text,
				date,
				status: blockedBy.includes(reciever) ? "blocked" : "sent",
				edited: 0
			}
			await Coll(table).insertOne(insertData)
			socket.emit("send-chat-success", reciever)
			console.log(`${sender} send message to ${reciever}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_chat-conv", async ({ current, who }) => {
		try {
			let table = await getTable("usnm", current, "usnm", who)
			if (table === undefined) return
			let conv = await Coll(table).find().toArray()
			socket.emit("res_chat-conv", { who, conv })
			console.log(`${current} wants chat with ${who}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("bc-req refresh-chat", data => {
		socket.broadcast.emit("bc-res refresh-chat", data)
	})

	socket.on("bc-req set-chat-read", async ({ reader, sender }) => {
		try {
			let table = await getTable("usnm", reader, "usnm", sender)
			await Coll(table).updateMany(
				{ sender, status: /sent|recieved/ },
				{ $set: { status: "read" } }
			)
			socket.broadcast.emit("bc-res set-chat-read", reader)
			console.log(`${reader} read all of ${sender}'s messages`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("bc-req refresh-list", _ => {
		socket.broadcast.emit("bc-res refresh-list")
	})

	socket.on("req_block-user", async ({ current, who }) => {
		try {
			await Users.updateOne(
				{ usnm: who },
				{ $push: { blockedBy: current } }
			)
			socket.emit("res_block-user")
			console.log(`${current} blocked ${who}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_unblock-user", async ({ current, who }) => {
		try {
			await Users.updateOne(
				{ usnm: who },
				{ $pull: { blockedBy: current } }
			)
			socket.emit("res_unblock-user")
			console.log(`${current} unblocked ${who}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})
}
