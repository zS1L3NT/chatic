import { useState } from "react"

export const useFadeState = (): [
	{ value: string; animation: string },
	(value: string) => void
] => {
	const [v, SETv] = useState({ value: "", animation: "" })
	return [
		v,
		(string: string) => {
			if (string === v.value) return undefined
			if (string === "") {
				SETv({ ...v, animation: "slideTextOut 1s forwards" })
				setTimeout(() => SETv({ value: "", animation: "" }), 1000)
			} else {
				SETv({ value: string, animation: "slideTextIn 1s forwards" })
			}
		}
	]
}
