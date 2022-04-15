import { CollectionReference, query, QueryConstraint } from "firebase/firestore"
import { useDebugValue } from "react"
import { useCollectionData } from "react-firebase-hooks/firestore"

const useAppCollection = <T extends Record<string, any>>(
	collRef: CollectionReference<T>,
	...constraints: QueryConstraint[]
): [T[], null] | [null, Error] | [null, null] => {
	const collectionQuery = constraints.length > 0 ? query(collRef, ...constraints) : collRef

	const [data, _, error] = useCollectionData(collectionQuery)

	useDebugValue([data, error])

	return data ? [data, null] : error ? [null, error] : [null, null]
}

export default useAppCollection
