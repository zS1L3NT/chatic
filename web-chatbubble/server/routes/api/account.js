const { ObjectId } = require("mongodb")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/auth")
const mail = require("../../mailer")
const { cloudinary } = require("../../../server")

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

const validID = new RegExp("^[0-9a-fA-F]{24}$")

// 400: Bad request
// 406: Unacceptable data
// 409: Conflict
// 411: Length
// 415: Unsupported Media Type

/**
 * @route   GET api/account/getData
 * @desc    Get user data
 * @access  Private
 */
router.get("/getData", auth, async (req, res) => {
	const { Users } = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	try {
		let user = await Users.findOne(ObjectId(req.user.id), {
			projection: { pswd: 0 }
		})
		if (!user) return res.status(400).send("ID Invalid")
		res.json(user)
	} catch (err) {
		res.status(500).json(err)
		return console.error(err)
	}
})

/**
 * @route   POST api/account/login
 * @desc    Login existing user
 * @access  Public
 */
router.post("/login", async (req, res) => {
	const { Users } = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	const { eml, pswd } = req.body

	// Validation
	if (!eml || !pswd) return res.status(411).send("Please enter all fields")
	if (!eml.match(/^\w+@\w+\.\w+/))
		return res.status(406).send("Please enter a valid email address")

	try {
		// Check for existing user
		let user = await Users.findOne({ eml })
		if (!user) return res.status(400).send("User does not exists")

		// Validate password
		let isMatch = await bcrypt.compare(pswd, user.pswd)
		if (!isMatch) return res.status(409).send("Invalid credentials")

		const online = require("../../global/online").all
		if (online.indexOf(user.usnm) >= 0)
			return res.status(409).send("User already logged in!")

		jwt.sign(
			{ id: user._id },
			config.get("jwtSecret"),
			{ expiresIn: 900 },
			(err, token) => {
				if (err)
					return res.status(500).send("Token authentication error")
				res.json({
					token,
					user: {
						id: user._id,
						usnm: user.usnm,
						eml: user.eml,
						phnm: user.phnm,
						pfp: user.pfp
					}
				})
			}
		)
	} catch (err) {
		res.status(500).json(err)
		return console.error(err)
	}
})

/**
	@route   POST api/account/register
	@desc    Register new user
	@access  Public
*/
router.post("/register", async (req, res) => {
	const { Users, NewColl } = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	const { usnm, eml, phnm, pswd } = req.body

	// Validation
	if (!usnm || !eml || !phnm || !pswd)
		return res.status(411).send("Please enter all fields")
	if (usnm === "ChatBot" || usnm === "sample")
		return res.status(406).send("Please choose another username")
	if (usnm.match(/[\b\[\b]|[\b\]\b]/g))
		return res.status(406).send("Invalid character entered")
	if (!eml.match(/^\w+@\w+\.\w+/))
		return res.status(406).send("Please enter a valid email address")
	if (!phnm.match(/^\d+$/))
		return res.status(406).send("Please enter a valid phone number")
	if (pswd.length < 8)
		return res
			.status(411)
			.send("Password needs to be at least 8 characters long")

	try {
		let user = await Users.findOne({ eml })
		if (user)
			return res.status(409).send("User with given email already exists")

		user = await Users.findOne({ phnm })
		if (user)
			return res
				.status(409)
				.send("User with given phone number already exists")

		bcrypt.genSalt(10, (err, salt) => {
			if (err) return res.status(500).send("Encryption error")
			bcrypt.hash(pswd, salt, async (err, hash) => {
				if (err) return res.status(500).send("Encryption error")
				const saving = await Users.insertOne({
					usnm,
					eml,
					phnm,
					pswd: hash,
					pfp: "user",
					blockedBy: [],
					verified: process.env.NODE_ENV !== "production",
					bio: "",
					followers: [],
					following: []
				})
				user = saving.ops[0]
				jwt.sign(
					{ id: user._id },
					config.get("jwtSecret"),
					{ expiresIn: 900 },
					async (err, token) => {
						if (err)
							return res
								.status(500)
								.send("Token authentication error")
						await NewColl(`["default","zS1L3NT","${user.usnm}"]`)
						res.json({
							token,
							user: {
								id: user._id,
								usnm: user.usnm,
								eml: user.eml,
								phnm: user.phnm
							}
						})
					}
				)
				await mail(user.eml, "w&v", user._id)
				console.log("New user registered:", usnm)
			})
		})
	} catch (err) {
		res.status(500).json(err)
		return console.error(err)
	}
})

/**
 * @route   DELETE api/account/deleteUser
 * @desc    Delete account
 * @access  Private
 */
router.delete("/deleteUser/:eml", auth, async (req, res) => {
	const {
		Users,
		Groups,
		AllCollections,
		Coll
	} = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	const { eml } = req.params

	try {
		let query = await Users.findOne({ eml })
		if (!query) return res.status(400).send("Invalid email")
		const { usnm, pfp } = query
		let tables = await AllCollections
		for (const table of tables) {
			const { name } = table
			// If table is not one of the defaults
			if (name.match(/^\[/)) {
				const parse = JSON.parse(name)
				if (
					parse[0] === "default" &&
					(parse[1] === usnm || parse[2] === usnm)
				) {
					// If table is a dm that includes me
					await Coll(name).drop()
					console.log(`${name} dropped`)
				} else if (parse.indexOf(usnm) > 0) {
					// If table is a group chat that includes me
					// If i am currently in the group chat
					let members = 0
					for (let i = 1; i < parse.length; i++)
						parse[i][0] !== "{" ? members++ : null
					if (members > 1) {
						// If the group still has members
						let renamed = name.replace(usnm, `{${usnm}}`)
						await Coll(name).rename(renamed)
						await Coll(renamed).insertOne({
							sender: "[ChatBot]",
							text: `"${usnm}" left the chat`,
							date: getDate(),
							status: "danger"
						})
						console.log("User left chat:", name)
					} else {
						// If there is no one left in the group, delete it
						const { icon } = await Groups.findOne({
							name: parse[0]
						})
						if (icon !== "group")
							await cloudinary.uploader.destroy(icon)
						await Coll(name).drop()
						await Groups.deleteOne({ name: parse[0] })
						console.log(`${name} deleted`)
					}
				}
			}
		}
		let all_blocking = await Users.find({ blockedBy: usnm })
		for (let i = 0; i < all_blocking.length; i++) {
			let user_blocking = all_blocking[i]
			await Users.updateOne(
				{ eml: user_blocking.eml },
				{ $pull: { blockedBy: usnm } }
			)
			console.log(`Unblocked ${user_blocking.usnm}`)
		}
		await Users.deleteOne({ eml })
		await cloudinary.uploader.destroy(pfp)
		console.log("Deleted account:", usnm)
		res.status(200).send("success")
	} catch (err) {
		res.status(500).json(err)
		return console.log(err)
	}
})

/**
 * @route   PUT api/account/updatePfp
 * @desc    Update user data
 * @access  Private
 */
router.put("/updatePfp", auth, async (req, res) => {
	const { Users } = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	const { usnm, pfp, base64 } = req.body

	try {
		if (pfp === "user") {
			let { url } = await cloudinary.uploader.upload(base64)
			await Users.updateOne(
				{ usnm },
				{ $set: { pfp: url.slice(62, -4) } }
			)
			console.log("Fresh user, fresh image")
			return res.status(200).send()
		} else {
			await cloudinary.uploader.destroy(pfp)
			console.log("Deleted old picture")
			if (!base64) {
				await Users.updateOne({ usnm }, { $set: { pfp: "user" } })
				console.log("No base 64. Resetting Picture")
				return res.status(200).send()
			} else {
				let { url } = await cloudinary.uploader.upload(base64)
				await Users.updateOne(
					{ usnm },
					{ $set: { pfp: url.slice(62, -4) } }
				)
				console.log("Uploaded new image")
				return res.status(200).send()
			}
		}
	} catch (err) {
		res.status(500).json(err)
		return console.error(err)
	}
})

/**
 * @route   PUT api/account/updatePswd
 * @desc    Update user data
 * @access  Public
 */
router.put("/updatePswd", (req, res) => {
	const { Users } = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	const { eml, pswd: newpswd } = req.body
	try {
		if (newpswd.length < 8)
			return res
				.status(411)
				.send("Password needs to be longer than 8 characters")
		bcrypt.genSalt(10, (err, salt) => {
			if (err) return res.status(500).send("Encryption error")
			bcrypt.hash(newpswd, salt, (err, hashpswd) => {
				if (err) return res.status(500).send("Encryption error")
				Users.updateOne({ eml }, { $set: { pswd: hashpswd } })
					.then(_ => res.status(200).send("done"))
					.catch(res.status(500).send)
			})
		})
	} catch (err) {
		res.status(500).json(err)
		return console.error(err)
	}
})

/**
 * @route   POST api/account/verify
 * @desc    Verify User
 * @access  Public
 */
router.post("/verify", (req, res) => {
	const { Users } = require("../../database/utilities")(
		require("../../database/service").MongoDB
	)
	const { _id } = req.body
	try {
		if (validID.test(_id)) {
			Users.findOne(ObjectId(_id)).then(data => {
				if (!data) return res.status(200).send("invalid-code")
				if (data.verified)
					return res.status(200).send("already-verified")
				Users.updateOne(
					{ _id: ObjectId(_id) },
					{ $set: { verified: true } }
				)
					.then(_ => res.status(200).send("user-verified"))
					.catch(res.status(500).send)
			})
		} else return res.status(200).send("invalid-code")
	} catch (err) {
		res.status(500).json(err)
		return console.error(err)
	}
})

module.exports = router
