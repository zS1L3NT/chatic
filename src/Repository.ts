import firebase from "firebase-admin"
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

type FS = firebase.firestore.Firestore
type FBColl =
	| firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
	| firebase.firestore.Query<firebase.firestore.DocumentData>
type FBDoc = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

class Repository {
	private firestore: FS

	constructor(firestore: FS) {
		this.firestore = firestore
	}

	public users() {
		return new (class extends FirestoreColl<IUser> {
			constructor(firestore: FS) {
				super(firestore.collection("users"))
			}
		})(this.firestore)
	}

	public user(uid: string) {
		return new (class extends FirestoreDoc<IUser, IUpdateUser> {
			private firestore: FS

			constructor(firestore: FS) {
				super(firestore.collection("users").doc(uid))
				this.firestore = firestore
			}

			public presence() {
				return new (class extends FirestoreColl<IPresenceData> {
					constructor(firestore: FS) {
						super(
							firestore
								.collection("users")
								.doc(uid)
								.collection("presence")
						)
					}
				})(this.firestore)
			}

			public presenceIP(ipv4: string) {
				return new (class extends FirestoreDoc<
					IPresenceData,
					IUpdatePresenceData
				> {
					constructor(firestore: FS) {
						super(
							firestore
								.collection("users")
								.doc(uid)
								.collection("presence")
								.doc(ipv4)
						)
					}
				})(this.firestore)
			}
		})(this.firestore)
	}

	public chats() {
		return new (class extends FirestoreColl<IChat> {
			constructor(firestore: FS) {
				super(firestore.collection("chats"))
			}
		})(this.firestore)
	}

	public chat(cid: string) {
		return new (class extends FirestoreDoc<IChat, IUpdateChat> {
			private firestore: FS

			constructor(firestore: FS) {
				super(firestore.collection("chats").doc(cid))
				this.firestore = firestore
			}

			public messages() {
				return new (class extends FirestoreColl<IMessage> {
					constructor(firestore: FS) {
						super(
							firestore
								.collection("chats")
								.doc(cid)
								.collection("messages")
						)
					}
				})(this.firestore)
			}

			public message(mid: string) {
				return new (class extends FirestoreDoc<
					IMessage,
					IUpdateMessage
				> {
					constructor(firestore: FS) {
						super(
							firestore
								.collection("chats")
								.doc(cid)
								.collection("messages")
								.doc(mid)
						)
					}
				})(this.firestore)
			}
		})(this.firestore)
	}

	public invites() {
		return new (class extends FirestoreColl<IInvite> {
			constructor(firestore: FS) {
				super(firestore.collection("invites"))
			}
		})(this.firestore)
	}

	public invite(iid: string) {
		return new (class extends FirestoreDoc<IInvite, IUpdateInvite> {
			constructor(firestore: FS) {
				super(firestore.collection("invites").doc(iid))
			}
		})(this.firestore)
	}

	public newChatID() {
		return this.firestore.collection("chats").doc().id
	}

	public newMessageID(cid: string) {
		return this.firestore
			.collection("chats")
			.doc(cid)
			.collection("messages")
			.doc().id
	}

	public newInviteID() {
		return this.firestore.collection("invites").doc().id
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
		opStr: FirebaseFirestore.WhereFilterOp,
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
		directionStr?: FirebaseFirestore.OrderByDirection | undefined
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

export default Repository
