import React, { useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import qs from "querystring"
import axios from "axios"
import useState from "./Hooks"
import { useHistory } from "react-router-dom"
import { Input, Label, Form, Button, Alert } from "reactstrap"
import { updatePswd } from "../redux/actions/authActions"

const $ = document.querySelector.bind(document)

export default function External(props) {
	const [eml, setEml] = useState("", "[eml]")
	const [res, setRes] = useState(null, "[res]")
	const history = useHistory()
	const dispatch = useDispatch()
	const params = qs.parse(history.location.search.slice(1))
	const { socket } = props
	const changePage = useCallback(props.changePage)

	const rand = length => {
		let result = ""
		let chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		for (let i = 0; i < length; i++)
			result += chars.charAt(Math.floor(Math.random() * chars.length))
		return result
	}

	const resetPswd = _ => {
		if (eml === "") return
		socket.emit("req_send-reset-pswd-email", {
			eml,
			key: rand(20),
			item: rand(80)
		})
	}

	const [pswd, setPswd] = useState("", "[pswd]")
	const [pswdConf, setPswdConf] = useState("", "[pswdConf]")
	const [pswdErr, setPswdErr] = useState(null, "[pswdErr]")
	const savePswd = _ => {
		if (pswd.length < 8)
			return setPswdErr(
				"Password needs to be at least 8 characters or longer"
			)
		if (pswd !== pswdConf) return setPswdErr("Passwords do not match")
		dispatch(
			updatePswd({
				eml: params.eml,
				pswd
			})
		)
		setTimeout(_ => changePage("/response?data=password-saved"), 1000)
	}

	useEffect(
		_ => {
			if (params.type === "verify") {
				axios
					.post("/api/account/verify", { _id: params.id })
					.then(res => changePage(`/response?data=${res.data}`))
			} else if (params.type === "reset") {
				let key
				Object.keys(params).map(param => {
					if (
						param !== "type" &&
						param !== "eml" &&
						Object.keys(params).length === 3
					) {
						return (key = param)
					}
					return null
				})
				socket.emit("req_verify-reset-pswd-token", {
					eml: params.eml,
					key,
					item: params[key]
				})
			}
		},
		[socket, changePage]
	)

	useEffect(() => {
		socket.on("res_send-reset-pswd-email", res => {
			if (res === "bad") {
				setRes({ msg: "Invalid email address", color: "danger" })
				setTimeout(_ => setRes(null), 3000)
			} else {
				setRes({ msg: "Email sent!", color: "success" })
				setTimeout(_ => setRes(null), 3000)
			}
		})
		socket.on("res_verify-reset-pswd-token", verified => {
			console.log("redirecting")
			if (!verified) changePage("/response?data=code-error")
		})
		return () => {
			socket.off("res_send-reset-pswd-email")
			socket.off("res_verify-reset-pswd-token")
		}
	}, [])

	if (params.type === "password") {
		return (
			<article id="externalPasswordPage">
				<Form
					className="form-signin"
					action="?#"
					onSubmit={e => e.preventDefault()}
					style={{ marginTop: "2.5rem" }}>
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
					{res ? <Alert color={res.color}>{res.msg}</Alert> : null}
					<div className="form-label-group" data-aos="fade-up">
						<Input
							id="eml"
							type="email"
							placeholder="Email address"
							style={{ height: "50px" }}
							onChange={e => setEml(e.target.value)}
							onKeyUp={e =>
								e.keyCode === 13 ? resetPswd() : null
							}
						/>
						<Label for="eml" style={{ userSelect: "none" }}>
							Email address
						</Label>
					</div>
					<Button
						color="primary"
						className="btn-lg"
						block
						onClick={resetPswd}>
						Send Password Reset Link
					</Button>
					<p className="text-center">
						<button
							type="button"
							className="btntoa mt-2"
							onClick={_ => changePage("/login")}>
							Back to Login
						</button>
					</p>
				</Form>
			</article>
		)
	} else if (params.type === "reset") {
		return (
			<article id="externalResetPage">
				<Form
					className="form-signin"
					action="?#"
					onSubmit={e => e.preventDefault()}
					style={{ marginTop: "2.5rem" }}>
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
					{pswdErr ? <Alert color="danger">{pswdErr}</Alert> : null}
					<div className="form-label-group" data-aos="fade-left">
						<Input
							id="pswd"
							type="password"
							placeholder="New Password"
							style={{ height: "50px" }}
							onChange={e => setPswd(e.target.value)}
							onKeyUp={e =>
								e.keyCode === 13 ? $("#pswdConf").focus() : null
							}
						/>
						<Label for="pswd" style={{ userSelect: "none" }}>
							New Password
						</Label>
					</div>
					<div className="form-label-group" data-aos="fade-right">
						<Input
							id="pswdConf"
							type="password"
							placeholder="Confirm New Password"
							style={{ height: "50px" }}
							onChange={e => setPswdConf(e.target.value)}
							onKeyUp={e =>
								e.keyCode === 13 ? savePswd() : null
							}
						/>
						<Label for="pswdConf" style={{ userSelect: "none" }}>
							Confirm New Password
						</Label>
					</div>
					<Button
						color="primary"
						className="btn-lg"
						block
						onClick={savePswd}>
						Save
					</Button>
				</Form>
			</article>
		)
	}
	return <></>
}
