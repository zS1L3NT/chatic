import { CollectionReference, doc } from "firebase/firestore"
import { useDebugValue } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

import useOnUpdate from "./useOnUpdate"

const useAppDocument = <T extends Record<string, any>>(
	collRef: CollectionReference<T>,
	path: string | null | undefined
): [T, null] | [null, Error] | [null, null] => {
	const docRef = doc(collRef, path || "-")

	const [data, _, error] = useDocumentData(docRef)

	useDebugValue([data || null, error || null])

	return useOnUpdate(data ? [data, null] : error ? [null, error] : [null, null])
}

export default useAppDocument
