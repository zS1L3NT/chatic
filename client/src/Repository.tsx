import firebase from "firebase/app"
import Firebase from "./Firebase"
import {
	IChat,
	IInvite,
	IMessage,
	IPresenceData,
	IUpdateChat,
	IUpdateInvite,
	IUpdateMessage,
	IUpdatePresenceData,
	IUpdateUser,
	IUser
} from "./Types"

type FBColl =
	| firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
	| firebase.firestore.Query<firebase.firestore.DocumentData>
type FBDoc = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

const { firestore } = Firebase

class Repository {
	public users() {
		return new (class extends FirestoreColl<IUser> {
			constructor() {
				super(firestore.collection("users"))
			}
		})()
	}

	public user(uid: string) {
		return new (class extends FirestoreDoc<IUser, IUpdateUser> {
			constructor() {
				super(firestore.collection("users").doc(uid))
			}

			public presence() {
				return new (class extends FirestoreColl<IPresenceData> {
					constructor() {
						super(
							firestore
								.collection("users")
								.doc(uid)
								.collection("presence")
						)
					}
				})()
			}

			public presenceIP(ipv4: string) {
				return new (class extends FirestoreDoc<
					IPresenceData,
					IUpdatePresenceData
				> {
					constructor() {
						super(
							firestore
								.collection("users")
								.doc(uid)
								.collection("presence")
								.doc(ipv4)
						)
					}
				})()
			}
		})()
	}

	public chats() {
		return new (class extends FirestoreColl<IChat> {
			constructor() {
				super(firestore.collection("chats"))
			}
		})()
	}

	public chat(cid: string) {
		return new (class extends FirestoreDoc<IChat, IUpdateChat> {
			constructor() {
				super(firestore.collection("chats").doc(cid))
			}

			public messages() {
				return new (class extends FirestoreColl<IMessage> {
					constructor() {
						super(
							firestore
								.collection("chats")
								.doc(cid)
								.collection("messages")
						)
					}
				})()
			}

			public message(mid: string) {
				return new (class extends FirestoreDoc<
					IMessage,
					IUpdateMessage
				> {
					constructor() {
						super(
							firestore
								.collection("chats")
								.doc(cid)
								.collection("messages")
								.doc(mid)
						)
					}
				})()
			}
		})()
	}

	public invites() {
		return new (class extends FirestoreColl<IInvite> {
			constructor() {
				super(firestore.collection("invites"))
			}
		})()
	}

	public invite(iid: string) {
		return new (class extends FirestoreDoc<IInvite, IUpdateInvite> {
			constructor() {
				super(firestore.collection("invites").doc(iid))
			}
		})()
	}

	public newChatID() {
		return firestore.collection("chats").doc().id
	}

	public newMessageID(cid: string) {
		return firestore
			.collection("chats")
			.doc(cid)
			.collection("messages")
			.doc().id
	}

	public newInviteID() {
		return firestore.collection("invites").doc().id
	}
}

abstract class FirestoreColl<T> {
	private coll: FBColl

	public constructor(coll: FBColl) {
		this.coll = coll
	}

	public observe(callback: (value: { [id: string]: T }) => void) {
		return this.coll.onSnapshot(snap => {
			const obj: { [id: string]: T } = {}
			snap.docs.forEach(doc => {
				obj[doc.id] = doc.data() as T
			})
			callback(obj)
		})
	}

	public get(callback: (value: { [id: string]: T }) => void) {
		this.coll.get().then(snap => {
			const obj: { [id: string]: T } = {}
			snap.docs.forEach(doc => {
				obj[doc.id] = doc.data() as T
			})
			callback(obj)
		})
	}

	public where(
		fieldPath: string | firebase.firestore.FieldPath,
		opStr: firebase.firestore.WhereFilterOp,
		value: any
	): FirestoreColl<T> {
		return new (class extends FirestoreColl<T> {
			constructor(coll: FBColl) {
				super(coll.where(fieldPath, opStr, value))
			}
		})(this.coll)
	}

	public orderBy(
		fieldPath: string | firebase.firestore.FieldPath,
		directionStr?: firebase.firestore.OrderByDirection | undefined
	) {
		return new (class extends FirestoreColl<T> {
			constructor(coll: FBColl) {
				super(coll.orderBy(fieldPath, directionStr))
			}
		})(this.coll)
	}
}

abstract class FirestoreDoc<T, UT> {
	private doc: FBDoc

	public constructor(doc: FBDoc) {
		this.doc = doc
	}

	public get(callback: (value: T) => void, empty?: () => void) {
		this.doc.get().then(snap => {
			if (snap.exists) {
				callback(snap.data() as T)
			} else {
				if (empty) empty()
			}
		})
	}

	public set(value: T) {
		return this.doc.set(value)
	}

	public update(value: UT) {
		return this.doc.update(value)
	}

	public remove() {
		return this.doc.delete()
	}

	public observe(callback: (value: T) => void, empty?: () => void) {
		return this.doc.onSnapshot(snap => {
			if (snap.exists) {
				callback(snap.data() as T)
			} else {
				if (empty) empty()
			}
		})
	}
}

export default new Repository()
