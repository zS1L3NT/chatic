import { doc, DocumentReference, getFirestore } from "firebase/firestore"
import { useDocumentData } from "react-firebase-hooks/firestore"

import firebaseApp from "../firebaseApp"

export default <C extends keyof iFirestoreCollections, T = iFirestoreCollections[C]>(
	coll: C,
	path?: string
): [T, null] | [null, Error] | [null, null] => {
	const firestore = getFirestore(firebaseApp)
	const docRef = doc(firestore, coll, path || "-") as DocumentReference<T>

	const [data, _, error] = useDocumentData(docRef)

	return data ? [data, null] : error ? [null, error] : [null, null]
}
