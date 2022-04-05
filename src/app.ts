import firebaseApp from "./firebaseApp"
import { getFirestore } from "firebase-admin/firestore"

const firestore = getFirestore(firebaseApp)

firestore.collection("statuses").onSnapshot(snaps =>
	snaps.docChanges().forEach(change => {
		const status = change.doc.data() as iStatus

		if (status.state === 0) {
			console.log(`Changing state of ${status.id}`)
			firestore.collection("statuses").doc(status.id).update({
				state: 3
			})
		}
	})
)
