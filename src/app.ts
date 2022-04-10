import { getFirestore } from "firebase-admin/firestore"

import firebaseApp from "./firebaseApp"

const firestore = getFirestore(firebaseApp)

firestore.collection("messages").onSnapshot(snaps =>
	snaps.docChanges().forEach(change => {
		const message = change.doc.data() as iMessage

		if (message.status === 0) {
			console.log(`Changing state of ${message.id}`)
			firestore.collection("messages").doc(message.id).update({
				state: 1
			})
		}
	})
)
