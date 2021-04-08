import express from "express"
import path from "path"
import admin from "firebase-admin"
import {
	Tlist,
	Tobject,
	Tstring,
	ValidateRequest
} from "validate-all-types"

import onMessage from "./onMessage"
import addToChat from "./addToChat"
import onChangeChat from "./onChangeChat"
import onAuthenticated from "./onAuthenticated"
import removeFromChat from "./removeFromChat"
import findInvite from "./findInvite"
import clearChat from "./clearChat"
import Repository from "./Repository"

const serviceAccount = require("../serviceAccountKey.json")
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://chatic-bubblejs-default-rtdb.firebaseio.com",
	storageBucket: "chatic-bubblejs.appspot.com"
})

const PORT = 2204
const app = express()
const Repo = new Repository(admin.firestore())

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, "..", "client", "build")))
app.use(function (req, res, next) {
	if (req.headers.host !== `localhost:${PORT}`) {
		next()
		return
	}
	res.header("Access-Control-Allow-Origin", "*")
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	)
	next()
})

app.get("/functions/clear", (_, res) => {
	console.clear()
	res.end()
})

app.post(
	"/functions/onMessage",
	ValidateRequest(
		"body",
		Tobject({
			uids: Tlist(Tstring()),
			cid: Tstring(),
			mid: Tstring(),
			message: Tstring()
		})
	),
	onMessage(Repo)
)

app.post(
	"/functions/addToChat",
	ValidateRequest(
		"body",
		Tobject({
			cid: Tstring(),
			uid: Tstring()
		})
	),
	addToChat(Repo)
)

app.post(
	"/functions/onChangeChat",
	ValidateRequest(
		"body",
		Tobject({
			uid: Tstring(),
			cid: Tstring(),
			ipv4: Tstring()
		})
	),
	onChangeChat(Repo)
)

app.post(
	"/functions/onAuthenticated",
	ValidateRequest(
		"body",
		Tobject({
			uid: Tstring()
		})
	),
	onAuthenticated(Repo)
)

app.post(
	"/functions/removeFromChat",
	ValidateRequest(
		"body",
		Tobject({
			cid: Tstring(),
			uid: Tstring()
		})
	),
	removeFromChat(Repo, admin.storage())
)

app.post(
	"/functions/findInvite",
	ValidateRequest(
		"body",
		Tobject({
			iid: Tstring()
		})
	),
	findInvite(Repo)
)

app.post(
	"/functions/clearChat",
	ValidateRequest(
		"body",
		Tobject({
			cid: Tstring(),
			uid: Tstring()
		})
	),
	clearChat(Repo)
)

app.get("*", (_req, res) => {
	res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"))
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
