import equal from "fast-deep-equal/es6/react"
import { useEffect, useState } from "react"

const useOnUpdate = <T,>(value: T): T => {
	const [data, setData] = useState(value)

	useEffect(() => {
		if (!equal(data, value)) {
			setData(value)
		}
	}, [data, value])

	return data
}

export default useOnUpdate
