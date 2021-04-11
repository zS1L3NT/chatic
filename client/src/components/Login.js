import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import useState from "./Hooks"
import qs from "querystring"
// Styling
import { Form, Label, Button, Input, Alert } from "reactstrap"
import { login } from "../redux/actions/authActions"

const $ = document.querySelector.bind(document)

export default function Login(props) {
	const auth = useSelector(state => state.auth)
	const error = useSelector(state => state.error)
	const history = useHistory()
	const dispatch = useDispatch()
	const params = qs.parse(history.location.search.slice(1))
	const [eml, setEml] = useState("", "[eml]")
	const [pswd, setPswd] = useState("", "[pswd]")
	const [err, setErr] = useState("", "[err]")
	const { changePage } = props

	useEffect(
		_ => {
			error.id === "LOGIN_FAIL" ? setErr(error.msg) : setErr(null)
		},
		[error]
	)
	useEffect(
		_ => {
			if (auth.isAuthenticated)
				changePage(
					"/response?data=logged-in" +
						[params.fw ? `&fw=${params.fw}` : ""]
				)
		},
		[auth, history, changePage, params]
	)

	const onSubmit = _ => dispatch(login({ eml, pswd }))

	return (
		<article id="loginPage">
			<Form
				className="form-signin"
				style={{ marginTop: "2.5rem" }}
				onSubmit={e => {
					e.preventDefault()
				}}>
				<div className="text-center mb-4">
					<img
						src="/icons/favicon.ico"
						className="mb-3"
						width="90"
						height="90"
						alt="logo"
						data-aos="zoom-in-up"
					/>
					<br />
					<img
						src="./icons/chatbubble.png"
						alt=""
						data-aos="zoom-out-down"
					/>
				</div>
				{err ? <Alert color="danger">{err}</Alert> : null}
				<div className="form-label-group animate__animated animate__fadeInDown">
					<Input
						id="eml"
						type="email"
						placeholder="Email address"
						style={{ height: "50px" }}
						onChange={e => setEml(e.target.value)}
						onKeyUp={e =>
							e.keyCode === 13 ? $("#pswd").focus() : null
						}
						autoComplete="eml"
					/>
					<Label for="eml" style={{ userSelect: "none" }}>
						Email address
					</Label>
				</div>
				<div className="form-label-group animate__animated animate__fadeInUp">
					<Input
						id="pswd"
						type="password"
						placeholder="Password"
						style={{ height: "50px" }}
						onChange={e => setPswd(e.target.value)}
						onKeyUp={e => (e.keyCode === 13 ? onSubmit() : null)}
						autoComplete="pswd"
					/>
					<Label for="pswd" style={{ userSelect: "none" }}>
						Password
					</Label>
				</div>
				<Button
					color="primary"
					className="btn-lg"
					block
					onClick={onSubmit}>
					Login
				</Button>
				<p className="text-center mt-2 mb-0">
					Don't have an account?
					<button
						type="button"
						className="btntoa"
						onClick={_ => changePage("/register")}>
						Register here!
					</button>
				</p>
				<p className="text-center">
					<button
						type="button"
						className="btntoa"
						onClick={_ => changePage("/external?type=password")}>
						Forgot your password?
					</button>
				</p>
			</Form>
		</article>
	)
}
