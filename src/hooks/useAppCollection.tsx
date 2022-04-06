import {
	collection, CollectionReference, getFirestore, query, QueryConstraint
} from "firebase/firestore"
import { useDebugValue } from "react"
import { useCollectionData } from "react-firebase-hooks/firestore"

import firebaseApp from "../firebaseApp"

const useAppCollection = <C extends keyof iFirestoreCollections, T = iFirestoreCollections[C]>(
	coll: C,
	...constraints: QueryConstraint[]
): [T[], null] | [null, Error] | [null, null] => {
	const firestore = getFirestore(firebaseApp)
	const collRef = collection(firestore, coll) as CollectionReference<T>
	const collectionQuery = constraints.length > 0 ? query(collRef, ...constraints) : collRef

	const [data, _, error] = useCollectionData(collectionQuery)

	useDebugValue([data, error])

	return data ? [data, null] : error ? [null, error] : [null, null]
}

export default useAppCollection
