import { useState, useDebugValue, useRef } from "react"

export default function useCustomState(initialValue, name) {
	const [value, setValue] = useState(initialValue)
	useDebugValue(`${name}: ${value}`)
	return [value, setValue]
}

export function useFocus() {
	const htmlElRef = useRef(null)
	const setFocus = _ => {
		htmlElRef.current && htmlElRef.current.focus()
	}

	return [htmlElRef, setFocus]
}
