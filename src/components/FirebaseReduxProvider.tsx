import firebaseApp from "../firebaseApp"
import store from "../store"
import useAppCollection from "../hooks/useAppCollection"
import useAppDocument from "../hooks/useAppDocument"
import { getAuth } from "firebase/auth"
import {
	collection,
	doc,
	getFirestore,
	limit,
	onSnapshot,
	orderBy,
	where
} from "firebase/firestore"
import { Provider } from "react-redux"
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect } from "react"

interface Props extends React.PropsWithChildren<{}> {}

const FirebaseReduxProvider = (props: Props) => {
	const auth = getAuth(firebaseApp)
	const firestore = getFirestore(firebaseApp)

	const [authUser, authLoading, authError] = useAuthState(auth)

	const [user, userError] = useAppDocument("users", authUser?.uid)
	// const [outgoingHandshakes, outgoingHandshakesError] = useAppCollection(
	// "handshakes",
	// where("requestId", "==", authUser?.uid)
	// )
	// const [incomingHandshakes, incomingHandshakesError] = useAppCollection(
	// "handshakes",
	// where("targetId", "==", authUser?.uid)
	// )
	// const [chats, chatsError] = useAppCollection(
	// "chats",
	// where("users", "array-contains", authUser?.uid),
	// orderBy("lastUpdated", "desc"),
	// limit(3) // TODO Change pagination limit once app is complete
	// )

	useEffect(() => {
		const unsubs = Array(1000)
			.fill(0)
			.map((_, i) =>
				onSnapshot(doc(collection(firestore, "users"), authUser?.uid || "-"), doc =>
					console.log(`Doc ${i}:`, doc.data())
				)
			)
		return () => unsubs.forEach(unsub => unsub())
	}, [authUser?.uid])

	return (
		<Provider store={store}>
			<slot />
		</Provider>
	)
}

export default FirebaseReduxProvider
