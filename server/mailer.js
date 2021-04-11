const nodemailer = require("nodemailer")
const config = require("config")

/**
 * Mailer function
 * @param {string} to Reciever's email address
 * @param {string} type Preset type of email
 * @param {string} data Preset data
 */
module.exports = (to, type, data) =>
	new Promise((resolve, reject) => {
		let subject
		let html
		let href =
			process.env.NODE_ENV === "production"
				? "http://chat.bubblejs.com/external"
				: "http://localhost:3000/external"

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: config.get("SMTP_USER"),
				pass: config.get("SMTP_PASS")
			}
		})

		if (type === "w&v") {
			subject = "Welcome to ChatBubble!"
			html = `<h1>Welcome to ChatBubble!</h1>
			<p>Verfiy your account to unblock chat using 
			<a href="${href}?type=verify&id=${data}">this link</a>
			</p>`
		}

		if (type === "rp") {
			subject = "Reset Account Password ChatBubble"
			html = `<h1>A request was made to reset your password for your ChatBubble account.</h1>
			<p>To reset your password, click <a href="${href}?type=reset&eml=${to}&${data.key}=${data.item}">here</a>.
			This link will only be valid for 5 minutes. If any new requests to reset password comes in, this link won't work.</p>`
		}

		const mailOptions = {
			from: "ChatBubble <zechariahtan144@gmail.com>",
			to,
			subject,
			html
		}

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) reject(err)
			else resolve(info.response)
		})
	})
