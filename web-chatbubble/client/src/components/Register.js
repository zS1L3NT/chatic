import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import useState from "./Hooks"
import qs from "querystring"
import { Form, Label, Button, Input, Alert } from "reactstrap"

// Redux
import { register } from "../redux/actions/authActions"

const $ = document.querySelector.bind(document)

export default function Register(props) {
	const auth = useSelector(state => state.auth)
	const error = useSelector(state => state.error)
	const history = useHistory()
	const dispatch = useDispatch()
	const params = qs.parse(history.location.search.slice(1))
	const [usnm, setUsnm] = useState("", "[usnm]")
	const [eml, setEml] = useState("", "[eml]")
	const [phnm, setPhnm] = useState("", "[phnm]")
	const [pswd, setPswd] = useState("", "[pswd]")
	const [err, setErr] = useState("", "[err]")
	const { changePage } = props

	useEffect(
		_ => {
			error.id === "REGISTER_FAIL" ? setErr(error.msg) : setErr(null)
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

	const onSubmit = _ => dispatch(register({ usnm, eml, phnm, pswd }))

	return (
		<article id="registerPage">
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
						data-aos="zoom-out-down"
					/>
					<br />
					<img
						src="./icons/chatbubble.png"
						alt=""
						data-aos="zoom-in-up"
					/>
				</div>
				{err ? <Alert color="danger">{err}</Alert> : null}
				<div className="form-label-group animate__animated animate__fadeInDown">
					<Input
						name="usnm"
						type="text"
						id="usnm"
						placeholder="Username"
						style={{ height: "50px" }}
						onChange={e => setUsnm(e.target.value)}
						onKeyUp={e =>
							e.keyCode === 13 ? $("#eml").focus() : null
						}
						autoComplete="usnm"
					/>
					<Label for="usnm" style={{ userSelect: "none" }}>
						Username
					</Label>
				</div>
				<div className="form-label-group animate__animated animate__fadeInRight">
					<Input
						name="eml"
						type="email"
						id="eml"
						placeholder="Email address"
						style={{ height: "50px" }}
						onChange={e => setEml(e.target.value)}
						onKeyUp={e =>
							e.keyCode === 13 ? $("#phnm").focus() : null
						}
						autoComplete="eml"
					/>
					<Label for="eml" style={{ userSelect: "none" }}>
						Email address
					</Label>
				</div>
				<div className="form-label-group animate__animated animate__fadeInLeft">
					<Input
						name="phnm"
						type="text"
						id="phnm"
						placeholder="Phone Number"
						style={{ height: "50px" }}
						onChange={e => setPhnm(e.target.value)}
						onKeyUp={e =>
							e.keyCode === 13 ? $("#pswd").focus() : null
						}
						autoComplete="phnm"
					/>
					<Label for="phnm" style={{ userSelect: "none" }}>
						Phone Number
					</Label>
				</div>
				<div className="form-label-group animate__animated animate__fadeInUp">
					<Input
						name="pswd"
						type="password"
						id="pswd"
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
					Register
				</Button>
				<p className="text-center mt-2">
					Already have an account?
					<button
						type="button"
						className="btntoa"
						onClick={_ => changePage("/login")}>
						Login here!
					</button>
				</p>
			</Form>
		</article>
	)
}
