import React from "react"
import "./ButtonSpinner.scss"

interface props {
	text?: string
	saving: boolean
	onClick: (e: React.FormEvent<HTMLButtonElement>) => void
}

export default function ButtonSpinner(props: props) {
	const { text, saving, onClick } = props

	return (
		<button
			className={"buttonspinner" + (saving ? " saving" : "")}
			type="button"
			onClick={onClick}>
			{saving ? "|" : (text || "Save")}
		</button>
	)
}
