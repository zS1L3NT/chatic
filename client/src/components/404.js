import React from "react"
import { Button } from "reactstrap"
import { useHistory } from "react-router-dom"

export default function PNF() {
	const history = useHistory()

	return (
		<article id="404Page" style={{ marginTop: "2.5rem" }}>
			<div className="text-center mb-4">
				<img
					src="/icons/favicon.ico"
					className="mb-3"
					width="90"
					height="90"
					alt="logo"
					data-aos="zoom-out-down"
				/>
				<br />
				<img
					src="./icons/chatbubble.png"
					alt=""
					data-aos="zoom-in-up"
				/>
			</div>
			<h1
				align="center"
				className="animate__animated animate__flash"
				style={{ animationIterationCount: "infinite" }}>
				404 - Page Not Found
			</h1>
			<br />
			<Button
				style={{ width: "30%" }}
				color="primary"
				className="btn-lg mx-auto"
				block
				onClick={_ => history.go(-1)}>
				Go back
			</Button>
		</article>
	)
}
