import React, { useEffect, useCallback } from "react"
import { useHistory } from "react-router-dom"
import useState from "./Hooks"
import qs from "querystring"

export default function Response(props) {
	const history = useHistory()
	const [msg, setMsg] = useState("", "[msg]")
	const params = qs.parse(history.location.search.slice(1))
	const { changePage } = props

	const redirect = useCallback(
		_ => {
			setTimeout(
				_ => changePage(`/${params.fw ? params.fw : "chat"}`),
				1500
			)
		},
		[changePage, params]
	)

	useEffect(
		_ => {
			switch (params.data) {
				case "already-verified":
					setMsg("Account already verified! Redirecting...")
					redirect()
					break
				case "user-verified":
					setMsg("Account verified! Redirecting...")
					window.location.pathname = "/chat"
					break
				case "invalid-code":
					setMsg("Invalid data input. Redirecting...")
					redirect()
					break
				case "code-error":
					setMsg("Code has expired. Redirecting...")
					redirect()
					break
				case "password-saved":
					setMsg("Password saved! Redirecting...")
					redirect()
					break
				case "logged-in":
					setMsg("User logged in. Redirecting...")
					redirect()
					break
				default:
					setMsg("Error occured... Redirecting...")
					redirect()
					break
			}
		},
		[params, redirect]
	)

	return (
		<article
			className="container"
			id="externalVerifyPage"
			style={{ height: "calc(100% - 56px - 56px)" }}>
			<div className="row h-100">
				<div
					className="col-md-4 m-auto bg-light"
					style={{
						borderRadius: "25px",
						padding: "25px 35px",
						textAlign: "center",
						width: "fit-content"
					}}
					data-aos="zoom-out">
					{msg}
				</div>
			</div>
		</article>
	)
}
