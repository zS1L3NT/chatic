import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { collection, CollectionReference, getFirestore } from "firebase/firestore"

export const firebaseApp = initializeApp({
	apiKey: "AIzaSyDJcMewiJS1CNcsuFInwLfTOkQssa3xYzc",
	authDomain: "chatic-messenger.firebaseapp.com",
	databaseURL: "https://chatic-messenger-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "chatic-messenger",
	storageBucket: "chatic-messenger.appspot.com",
	messagingSenderId: "585323220439",
	appId: "1:585323220439:web:6c5ea3fd37e56a7b768f92",
	measurementId: "G-QBDNK49XSD"
})

export const auth = getAuth(firebaseApp)

export const firestore = getFirestore(firebaseApp)

export const usersColl = collection(firestore, "users") as CollectionReference<iUser>

// prettier-ignore
export const friendshipsColl = collection(firestore, "friendships") as CollectionReference<iFriendship>

export const handshakesColl = collection(firestore, "handshakes") as CollectionReference<iHandshake>

export const presencesColl = collection(firestore, "presences") as CollectionReference<iPresence>

export const chatsColl = collection(firestore, "chats") as CollectionReference<iChat>

export const messagesColl = collection(firestore, "messages") as CollectionReference<iMessage>
