import React, { useEffect, useState } from "react"
import "./ConfirmMenu.scss"

interface props {
	SETcfm: React.Dispatch<React.SetStateAction<boolean>>
	action: string
	trueMsg: string
	falseMsg: string
	onRes: (res: boolean) => void
}

export default function ConfirmMenu(props: props) {
	const { SETcfm, action, trueMsg, falseMsg, onRes } = props

	const [alive, SETalive] = useState(false)

	useEffect(() => {
		SETalive(true)
	}, [])

	return (
		<section className="confirmmenu">
			<div
				className={"confirmmenu__bg" + (alive ? " active" : "")}
				onClick={async () => {
					onRes(false)
					SETalive(false)

					await new Promise(res => setTimeout(res, 300))
					SETcfm(false)
				}}></div>
			<form className={"confirmmenu__form" + (alive ? " active" : "")}>
				<h3 className="confirmmenu__form__title">Are you sure you want to {action}?</h3>
				<button
					type="button"
					className="confirmmenu__form__false"
					onClick={async () => {
						onRes(false)
						SETalive(false)

						await new Promise(res => setTimeout(res, 300))
						SETcfm(false)
					}}>
					{falseMsg}
				</button>
				<button
					type="button"
					className="confirmmenu__form__true"
					onClick={async () => {
						onRes(true)
						SETalive(false)

						await new Promise(res => setTimeout(res, 300))
						SETcfm(false)
					}}>
					{trueMsg}
				</button>
			</form>
		</section>
	)
}
