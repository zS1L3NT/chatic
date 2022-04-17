import { CollectionReference, getFirestore } from "firebase-admin/firestore"

import firebaseApp from "./firebaseApp"

const firestore = getFirestore(firebaseApp)
const messagesColl = firestore.collection("messages") as CollectionReference<iMessage>

messagesColl
	.get()
	.then(snaps =>
		Promise.all(
			snaps.docs
				.map(snap => {
					const message = snap.data()
					if (message.content === null) return snap.ref.delete()
					if (message.status === 0) return snap.ref.update({ status: 1 })
					return
				})
				.filter(Boolean) as Promise<FirebaseFirestore.WriteResult>[]
		)
	)
	.then(() => {
		messagesColl.onSnapshot(snaps => {
			snaps.docChanges().forEach(change => {
				if (change.type === "modified" && change.doc.data().content === null) {
					change.doc.ref.delete().catch(console.error)
				}

				if (change.type === "added" && change.doc.data().status === 0) {
					change.doc.ref.update({ status: 1 }).catch(console.error)
				}
			})
		})
	})
	.catch(console.error)
