require("colors")
const token = require("../global/token")
const mail = require("./../mailer")

module.exports = socket => {
	const { Users } = require("../database/utilities")(
		require("../database/service").MongoDB
	)
	socket.on("req_send-reset-pswd-email", async ({ eml, key, item }) => {
		try {
			let user = await Users.findOne({ eml })
			if (user) {
				token.set(eml, key, item)
				setTimeout(_ => token.clear(eml), 300000)
				await mail(eml, "rp", { key, item })
				socket.emit("res_send-reset-pswd-email", "ok")
				console.log(`Sendt password reset email to ${eml}`)
			} else socket.emit("res_send-reset-pswd-email", "bad")
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	})

	socket.on("req_verify-reset-pswd-token", ({ eml, key, item }) => {
		if (eml in token.all) {
			if (token.all[eml].key === key && token.all[eml].item === item) {
				token.clear(eml)
				console.log(`${eml}'s password reset token is verified`)
				return socket.emit("res_verify-reset-pswd-token", true)
			}
			console.log(`${eml}'s password reset token is wrong`)
			return socket.emit("res_verify-reset-pswd-token", false)
		}
		console.log(`${eml}'s password reset token does not exist`)
		return socket.emit("res_verify-reset-pswd-token", false)
	})

	socket.on("req_send-verification-email", async data => {
		await mail(data.eml, "w&v", data._id)
		socket.emit("res_send-verification-email")
		console.log(`Sending account verification email to ${data.eml}`)
	})
}
