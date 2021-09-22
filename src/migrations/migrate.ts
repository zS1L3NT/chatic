import admin from "firebase-admin"
import { Document } from "../models"
import {
	userData,
	friendshipData,
	handshakeData,
	presenceData,
	chatData,
	messageData,
	inviteData,
	statusData
} from "./data"
import util from "util"

const config = require("../../config.json")

admin.initializeApp({
	credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore()

const users = db.collection("users")
const friendships = db.collection("friendships")
const handshakes = db.collection("handshakes")
const presences = db.collection("presences")
const chats = db.collection("chats")
const messages = db.collection("messages")
const invites = db.collection("invites")
const statuses = db.collection("statuses")

const migrate = async () => {
	const promises = [
		...await migrateCollection("users", users, userData),
		...await migrateCollection("friendships", friendships, friendshipData),
		...await migrateCollection("handshakes", handshakes, handshakeData),
		...await migrateCollection("presences", presences, presenceData),
		...await migrateCollection("chats", chats, chatData),
		...await migrateCollection("messages", messages, messageData),
		...await migrateCollection("invites", invites, inviteData),
		...await migrateCollection("statuses", statuses, statusData)
	]

	Promise
		.allSettled(promises)
		.then(results => {
			results.forEach((result, i) => {
				if (result.status === "rejected") {
					console.error(`Failed at query ${i.toString().padEnd(3, " ")}:`, result.reason)
				}
			})
			if (results.length > 0 && results.filter(r => r.status === "rejected").length === 0) {
				console.log(`Migrations successful`)
				console.log(`Changes: ${results.length}`)
			} else {
				console.log(`Nothing to migrate`)
			}
		})
}

const migrateCollection = async (
	name: string,
	coll: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
	dataset: Document[]
): Promise<Promise<any>[]> => {
	name = name.padEnd(12, " ") + ":"
	const snaps = await coll.get()
	const promises: Promise<any>[] = []

	// Delete unrelated documents
	snaps.forEach(snap => {
		if (!dataset.map(data => data.id).includes(snap.id)) {
			console.log(`${name} Unrelated document ${snap.id}`)
			promises.push(coll.doc(snap.id).delete())
		}
	})

	// Include missing documents
	dataset.forEach(data => {
		if (!snaps.docs.map(snap => snap.id).includes(data.id)) {
			console.log(`${name} Missing document ${data.id}`)
			promises.push(coll.doc(data.id).set(data))
		}
	})

	// Revert changed documents
	snaps.forEach(snap => {
		const data = dataset.filter(data => data.id === snap.id)[0]
		if (data) {
			if (!util.isDeepStrictEqual(data, snap.data())) {
				console.log(`${name} Data changed ${snap.id}`)
				promises.push(coll.doc(snap.id).set(data))
			}
		}
	})

	return promises
}

migrate()