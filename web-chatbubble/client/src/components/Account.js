import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import useState from "./Hooks"
import { Alert, Input, Label } from "reactstrap"

import { deleteUser, updatePfp, updatePswd } from "../redux/actions/authActions"

const $ = document.querySelector.bind(document)
const time = sec =>
	new Promise(async resolve => await setTimeout(_ => resolve(), sec))

export default function Account(props) {
	const auth = useSelector(state => state.auth)
	const browser = useSelector(state => state.browser)
	const loading = useSelector(state => state.loading)
	const dispatch = useDispatch()
	const [pswd, SETpswd] = useState("", "[pswd]")
	const [code, SETcode] = useState("", "[code]")
	const [confirm, SETconfirm] = useState("", "[confirm]")
	const [base64, SETbase64] = useState("", "[base64]")
	const [pswdErr, SETpswdErr] = useState(null, "[pswdErr]")
	const [codeErr, SETcodeErr] = useState(false, "[codeErr]")
	const [savepfp, SETsavepfp] = useState("Save Image", "[savepfp]")
	const [deletepfp, SETdeletepfp] = useState(
		"Delete Old Image",
		"[deletepfp]"
	)
	const [deleteacc, SETdeleteacc] = useState("Delete Account", "[deleteacc]")
	const [savepswd, SETsavepswd] = useState("Save Password", "[savepswd]")
	const { changePage } = props

	useEffect(
		_ => {
			if (loading.savingpfp) {
				SETsavepfp(
					<span>
						<i className="fa fa-spinner fa-spin mr-1"></i>Saving...
					</span>
				)
			} else {
				SETsavepfp("Save Image")
				$("#closeEditPfpModal1").click()
				SETbase64("")
			}
		},
		[loading.savingpfp]
	)

	useEffect(
		_ => {
			if (loading.deletingpfp) {
				SETdeletepfp(
					<span>
						<i className="fa fa-spinner fa-spin mr-1"></i>
						Deleting...
					</span>
				)
			} else {
				SETdeletepfp("Delete Old Image")
				$("#closeEditPfpModal1").click()
			}
		},
		[loading.deletingpfp]
	)

	useEffect(
		_ => {
			if (loading.savingpswd) {
				SETsavepswd(
					<span>
						<i className="fa fa-spinner fa-spin mr-1"></i>Saving...
					</span>
				)
			} else {
				SETsavepswd("Save Password")
				$("#closeEditPfpModal2").click()
				SETpswd("")
			}
		},
		[loading.savingpswd]
	)

	const img = {
		border: "5px solid lightgray",
		borderRadius: "50%",
		display: "block",
		width: "80px",
		height: "80px"
	}
	const lbl = { width: "calc(100%", marginTop: "18px", position: "relative" }
	const bubble = {
		backgroundColor: "white",
		padding: "20px",
		borderRadius: "15px"
	}
	const textbox = { height: "50px", backgroundColor: "lightgray" }

	useEffect(
		_ => {
			if (!auth.isAuthenticated) changePage("/login?fw=account")
		},
		[auth, changePage]
	)
	useEffect(_ => {
		SETcode(random(10))
	}, [])

	const deletePfp = _ =>
		dispatch(
			updatePfp({
				usnm: auth.user.usnm,
				pfp: auth.user.pfp,
				base64: ""
			})
		)
	const savePfp = _ => {
		if (!base64) return
		dispatch(
			updatePfp({
				usnm: auth.user.usnm,
				pfp: auth.user.pfp,
				base64
			})
		)
	}
	const savePswd = async _ => {
		if (!pswd) {
			SETpswdErr("Password cannot be empty")
			SETsavepswd("Save Password")
			await time(3000)
			return SETpswdErr(null)
		} else if (pswd.length < 8) {
			SETpswdErr("Password needs to be longer than 8 characters")
			SETsavepswd("Save Password")
			await time(3000)
			return SETpswdErr(null)
		}
		dispatch(
			updatePswd({
				eml: auth.user.eml,
				pswd
			})
		)
	}
	const deleteAccount = _ => {
		if (confirm === code) {
			SETdeleteacc(
				<span>
					<i className="fa fa-spinner fa-spin mr-1"></i>Deleting
					Account...
				</span>
			)
			return dispatch(deleteUser(auth.user.eml))
		}
		SETcode(random(10))
		SETcodeErr(true)
		SETconfirm("")
		setTimeout(_ => SETcodeErr(false), 2000)
	}

	const random = length => {
		let result = ""
		let chars =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length))
		}
		return result
	}

	const [label, setLabel] = useState({ class: "", html: "Choose file" })
	const previewFile = e => {
		let input = $("#img-input")
		const reader = new FileReader()
		setLabel({ class: "selected", html: input.value.split("\\").pop() })
		reader.addEventListener("load", _ => SETbase64(reader.result), false)
		if (input.files[0]) reader.readAsDataURL(input.files[0])
	}

	return (
		<article id="accountPage">
			<div
				className={
					"mt-2" +
					[browser === "desktop" ? " mx-auto col-7" : " mx-3"]
				}>
				<h1
					className="text-center"
					data-aos="fade-down"
					data-aos-once="true">
					Account
				</h1>
				<hr />
				<div
					className="mb-4"
					style={bubble}
					data-aos="fade-right"
					data-aos-once="true">
					<h3>Update Profile Picture</h3>
					<hr />
					<img
						style={img}
						src={`https://res.cloudinary.com/chatbubble/image/upload/${auth.user.pfp}.png`}
						alt="Profile"
						id="pfpviewer"
						className="mx-auto"
					/>
					<button
						type="button"
						data-toggle="modal"
						data-target="#change-img"
						className="btntoa mx-auto d-block"
						id="save-pfp-modal-btn">
						Edit Picture
					</button>
				</div>

				<div
					className="mb-4"
					style={bubble}
					data-aos="fade-left"
					data-aos-once="true">
					<h3>Authentication</h3>
					<hr />
					<button
						type="button"
						data-toggle="modal"
						data-target="#change-pswd"
						className="btntoa mx-auto d-block"
						id="save-pswd-modal-btn">
						Change Password
					</button>
					<button
						type="button"
						data-toggle="modal"
						data-target="#delete-account"
						className="btntoa mx-auto d-block"
						id="delete-account-modal-btn">
						Delete Account
					</button>
				</div>
			</div>

			<section
				className="modal fade"
				id="change-img"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="change-img-label"
				aria-hidden="true">
				<div
					className="modal-dialog modal-dialog-centered"
					role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="change-img-label">
								Choose an image
							</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<input
								type="file"
								name="file"
								className="custom-file-input d-none"
								id="img-input"
								onChange={previewFile}
								accept="image/*"
							/>
							<label
								className={`custom-file-label ml-auto ${label.class}`}
								style={lbl}
								onClick={_ => $("#img-input").click()}>
								{label.html}
							</label>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="d-none"
								id="closeEditPfpModal1"
								data-dismiss="modal"></button>
							<button
								type="button"
								className="btn btn-danger mr-auto"
								onClick={deletePfp}
								disabled={auth.user.pfp === "user"}>
								{deletepfp}
							</button>
							<button
								type="button"
								className="btn btn-success"
								onClick={savePfp}
								disabled={!base64}>
								{savepfp}
							</button>
						</div>
					</div>
				</div>
			</section>
			<section
				className="modal fade"
				id="change-pswd"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="change-pswd-label"
				aria-hidden="true">
				<div
					className="modal-dialog modal-dialog-centered"
					role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="change-pswd-label">
								Enter new password
							</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							{pswdErr ? (
								<Alert color="danger">{pswdErr}</Alert>
							) : null}
							<div className="form-label-group">
								<Input
									type="text"
									name="pswd"
									id="pswd"
									style={textbox}
									onChange={e => SETpswd(e.target.value)}
									value={pswd}
									autoComplete="off"
									placeholder="New password here..."
									onKeyUp={e =>
										e.keyCode === 13
											? $("#save-pswd-btn").click()
											: null
									}
								/>
								<Label
									for="pswd"
									style={{ userSelect: "none" }}>
									New password here...
								</Label>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="d-none"
								id="closeEditPfpModal2"
								data-dismiss="modal"></button>
							<button
								type="button"
								className="btn btn-success"
								onClick={savePswd}
								id="save-pswd-btn">
								{savepswd}
							</button>
						</div>
					</div>
				</div>
			</section>
			<section
				className="modal fade"
				id="delete-account"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="delete-account-label"
				aria-hidden="true">
				<div
					className="modal-dialog modal-dialog-centered"
					role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5
								className="modal-title"
								id="delete-account-label">
								Delete Account
							</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<h5 style={{ userSelect: "none" }}>
								Enter confirmation code: {code}
							</h5>
							{codeErr ? (
								<Alert color="danger">
									Invalid code. Try again
								</Alert>
							) : (
								<br />
							)}
							<div className="form-label-group">
								<Input
									type="text"
									name="confirm"
									id="confirm"
									style={textbox}
									onChange={e => SETconfirm(e.target.value)}
									value={confirm}
									autoComplete="off"
									placeholder="Enter confirmation text..."
									onKeyUp={e =>
										e.keyCode === 13
											? $("#delete-account-btn").click()
											: null
									}
								/>
								<Label
									for="confirm"
									style={{ userSelect: "none" }}>
									Enter confirmation text...
								</Label>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-danger"
								onClick={deleteAccount}
								id="delete-account-btn">
								{deleteacc}
							</button>
						</div>
					</div>
				</div>
			</section>
		</article>
	)
}
