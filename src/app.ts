import admin from "firebase-admin"

const config = require("../config.json")

admin.initializeApp({
	credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore()

db.collection("statuses").onSnapshot(snaps =>
	snaps.docChanges().forEach(change => {
		const status = change.doc.data() as iStatus

		if (status.state === 0) {
			console.log(`Changing state of ${status.id}`)
			db.collection("statuses").doc(status.id).update({
				state: 3
			})
		}
	})
)