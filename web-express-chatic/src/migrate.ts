import { CollectionReference, getFirestore } from "firebase-admin/firestore"
import util from "util"

import {
	chatData, friendshipData, handshakeData, messageData, presenceData, userData
} from "./data"
import firebaseApp from "./firebaseApp"

const firestore = getFirestore(firebaseApp)

const getCollection = <
	T extends keyof iFirestoreCollections,
	C extends Record<string, any> = iFirestoreCollections[T]
>(
	collection: T
): CollectionReference<C> => {
	return firestore.collection(collection) as CollectionReference<C>
}

const users = getCollection("users")
const friendships = getCollection("friendships")
const handshakes = getCollection("handshakes")
const presences = getCollection("presences")
const chats = getCollection("chats")
const messages = getCollection("messages")

const migrateCollection = async <
	T extends keyof iFirestoreCollections,
	C extends { id: string } = iFirestoreCollections[T]
>(
	name: T,
	coll: CollectionReference<C>,
	dataset: C[]
): Promise<Promise<any>[]> => {
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

const migrate = async () => {
	const promises = [
		...(await migrateCollection("users", users, userData)),
		...(await migrateCollection("friendships", friendships, friendshipData)),
		...(await migrateCollection("handshakes", handshakes, handshakeData)),
		...(await migrateCollection("presences", presences, presenceData)),
		...(await migrateCollection("chats", chats, chatData)),
		...(await migrateCollection("messages", messages, messageData))
	]

	Promise.allSettled(promises).then(results => {
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

migrate()
