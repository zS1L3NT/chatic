import { doc, DocumentReference, getFirestore } from "firebase/firestore"
import { useDebugValue } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

import firebaseApp from "../firebaseApp"

const useAppDocument = <C extends keyof iFirestoreCollections, T = iFirestoreCollections[C]>(
	coll: C,
	path: string | null | undefined
): [T, null] | [null, Error] | [null, null] => {
	const firestore = getFirestore(firebaseApp)
	const docRef = doc(firestore, coll, path || "-") as DocumentReference<T>

	const [data, _, error] = useDocumentData(docRef)

	useDebugValue([data || null, error || null])

	return data ? [data, null] : error ? [null, error] : [null, null]
}

export default useAppDocument
