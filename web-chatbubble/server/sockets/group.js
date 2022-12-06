require("colors")
const path = require("path")
const { cloudinary } = require("..")

module.exports = (socket, getDate) => {
	const {
		Groups,
		Coll,
		getTable,
		NewColl
	} = require("../database/utilities")(require("../database/service").MongoDB)
	socket.on("req_create-group", async ({ name, usnms, base64 }) => {
		try {
			let URL
			if (base64) {
				let res = await cloudinary.uploader.upload(
					base64 ||
						path.resolve(
							__dirname,
							"../client/public/icons/group.png"
						)
				)
				URL = res.url.slice(62, -4)
			} else URL = "group"
			let table = `["${name}"`
			usnms.map(usnm => (table += `,"${usnm}"`))
			table += `]`
			await NewColl(table)
			await Groups.insertOne({ name, icon: URL })
			socket.emit("res_create-group")
			console.log(`New group ${name} with members:`, usnms)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_group-conv", async group => {
		try {
			let table = await getTable("group", group)
			let conv = await Coll(table).find().toArray()
			socket.emit("res_group-conv", { group, conv })
			console.log(`Someone is requesting chat from group: ${group}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("send-group", async ({ sender, group, text, date }) => {
		try {
			let table = await getTable("group", group)
			var insertData = {
				sender,
				text,
				date,
				edited: 0
			}
			await Coll(table).insertOne(insertData)
			socket.emit("send-group-success", group)
			console.log(`${sender} sent a message to ${group}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_leave-group", async ({ who, group }) => {
		try {
			let table = await getTable("group", group)
			let parse = JSON.parse(table)
			let members = 0
			for (let i = 1; i < parse.length; i++)
				parse[i][0] !== "{" ? members++ : null
			if (members > 1) {
				let renamed = table.replace(who, `{${who}}`)
				await Coll(table).rename(renamed)
				await Coll(renamed).insertOne({
					sender: "[ChatBot]",
					text: `"${who}" left the chat`,
					date: getDate(),
					status: "danger"
				})
			} else {
				let { icon } = await Groups.findOne({
					name: group.slice(1, -1)
				})
				if (icon !== "group") await cloudinary.uploader.destroy(icon)
				await Coll(table).drop()
				await Groups.deleteOne({ name: group.slice(1, -1) })
			}
			socket.emit("res_leave-group", group)
			console.log(`${who} left ${group}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_join-group", async ({ me, who, group }) => {
		try {
			let renamed
			let table = await getTable("group", group)
			let parse = JSON.parse(table)
			for (let i = 1; i < parse.length; i++) {
				const usnm = parse[i]
				if (who === usnm) return
				if (`{${who}}` === usnm) {
					renamed = table.replace(usnm, who)
					await Coll(table).rename(renamed)
					await Coll(renamed).insertOne({
						sender: "[ChatBot]",
						text: `"${me}" added "${who}" to the chat`,
						date: getDate(),
						status: "success"
					})
					console.log(`${me} added ${who} to ${group}`)
					return socket.emit("res_join-group")
				}
			}
			renamed = table.slice(0, -1) + `,"${who}"]`
			await Coll(table).rename(renamed)
			await Coll(renamed).insertOne({
				sender: "[ChatBot]",
				text: `"${me}" added "${who}" to the chat`,
				date: getDate(),
				status: "success"
			})
			socket.emit("res_join-group", group)
			console.log(`${me} added ${who} to ${group}`)
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("bc-req refresh-group", group => {
		socket.broadcast.emit("bc-res refresh-group", group)
	})
}
