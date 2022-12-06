import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import useState from "../../Hooks"
import {
	TransitionGroup as TG,
	CSSTransition as CT
} from "react-transition-group"
import { Input, Label, Alert } from "reactstrap"

const $ = document.querySelector.bind(document)

export default function AddGroup(props) {
	const auth = useSelector(state => state.auth)
	const [err, SETerr] = useState(null, "[err]")
	const [name, SETname] = useState("", "[name]")
	const [phnm, SETphnm] = useState("", "[phnm]")
	const [searching, SETsearching] = useState(false, "[searching]")
	const [base64, SETbase64] = useState("", "[base64]")
	const [members, EDITmembers] = useState([], "[members]")
	const [response, SETresponse] = useState(
		{ usnm: "", pfp: "" },
		"[response]"
	)
	const [label, SETlabel] = useState(
		{ name: "Icon...", class: "" },
		"[label]"
	)
	const { socket, cloudinary } = props

	useEffect(_ => {
		socket.on("group_found_user", res => {
			SETresponse(res)
			SETsearching(false)
			console.log(`>>> SocketIO on('group_found_user')`)
		})
		socket.on("group_no_user", _ => SETsearching(false))
		socket.on("res_create-group", _ => {
			$("[data-dismiss=modal]").click()
			props.closeref()
		})
		return _ => {
			socket.off("group_found_user")
			socket.off("group_no_user")
			socket.off("res_create-group")
		}
	})

	const findUser = _ => {
		if (phnm !== auth.user.phnm) {
			socket.emit("group_search_user", phnm)
			SETsearching(true)
		}
	}

	const addToGroup = _ => {
		if (JSON.stringify(members).indexOf(JSON.stringify(response)) < 0)
			EDITmembers([...members, response])
		SETresponse({ usnm: "", pfp: "" })
		SETphnm("")
		$("#phnm").focus()
	}

	const removeFromGroup = e =>
		EDITmembers(members.filter(member => member.usnm !== e.target.alt))

	const onFileChange = _ => {
		let input = $("#imgin")
		const reader = new FileReader()
		SETlabel({ class: "selected", name: input.value.split("\\").pop() })
		reader.addEventListener("load", _ => SETbase64(reader.result), false)
		if (input.files[0]) reader.readAsDataURL(input.files[0])
	}

	const createGroup = _ => {
		SETerr(null)
		if (name === "") {
			SETerr("Group name cannot be empty")
			setTimeout(_ => SETerr(null), 3000)
		} else if (members.length === 0) {
			SETerr("Group must have members")
			setTimeout(_ => SETerr(null), 3000)
		} else {
			var usnms = [auth.user.usnm]
			members.map(member => usnms.push(member.usnm))
			socket.emit("req_create-group", {
				name,
				usnms,
				base64
			})
		}
	}

	return (
		<form
			className="pb-0"
			style={{ padding: "20px" }}
			onSubmit={e => e.preventDefault()}>
			<h3>Create a chat group</h3>
			<hr />

			<TG>
				{err ? (
					<CT timeout={500} classNames="item">
						<Alert className="alert alert-danger">{err}</Alert>
					</CT>
				) : null}
			</TG>

			<TG>
				{members.map(member => (
					<CT key={member.usnm} timeout={500} classNames="item">
						<div className="mb-3 d-inline-block w-50">
							<img
								src={`${cloudinary}${member.pfp}.png`}
								alt={member.usnm}
								className="d-inline br-50 mw-40 mh-40"
								style={{ marginRight: "10px" }}
								onClick={removeFromGroup}
								onMouseOver={e =>
									(e.target.src = "./icons/cross.png")
								}
								onMouseOut={e =>
									(e.target.src = `${cloudinary}${member.pfp}.png`)
								}
							/>
							<h5 className="d-inline">{member.usnm}</h5>
						</div>
					</CT>
				))}
			</TG>

			<div className="form-label-group">
				<Input
					name="name"
					type="text"
					id="name"
					placeholder="Type in group name..."
					style={{ height: "50px" }}
					onChange={e => SETname(e.target.value)}
					className="bgcol-lg"
					onKeyUp={e =>
						e.keyCode === 13 ? $("#phnm").focus() : null
					}
				/>
				<Label for="name" style={{ userSelect: "none" }}>
					Type in group name...
				</Label>
			</div>
			<div className="form-label-group d-flex">
				<Input
					name="phnm"
					type="text"
					id="phnm"
					placeholder="Type in the members' phone numbers"
					style={{ height: "50px" }}
					className="bgcol-lg"
					onKeyUp={e => (e.keyCode === 13 ? findUser : null)}
					value={phnm}
					onChange={e => {
						SETphnm(e.target.value)
						SETresponse({ usnm: "", pfp: "" })
					}}
				/>
				<Label for="phnm" style={{ userSelect: "none" }}>
					Add member...
				</Label>
				<div className="input-group-append" title="Scroll to bottom">
					<button
						onClick={findUser}
						id="newMsgBtn"
						type="submit"
						className="btn btn-link">
						<i
							className={
								"color-lg fa fa-" +
								[searching ? "spinner fa-spin" : "search"]
							}></i>
					</button>
				</div>
			</div>
			<TG>
				{response.usnm ? (
					<CT timeout={500} classNames="item">
						<div
							className="bgcol-lg mb-3 p-2 d-flex"
							style={{ borderRadius: "15px" }}>
							<img
								src={`${cloudinary}${response.pfp}.png`}
								alt=""
								className="mx-2 br-50 mh-40 mw-40"
							/>
							<h4 className="mb-0 my-auto">{response.usnm}</h4>
							<button
								onClick={addToGroup}
								type="button"
								id="addBtn"
								className="btn btn-primary ml-auto">
								Add
							</button>
						</div>
					</CT>
				) : null}
			</TG>

			<div className="custom-file mb-2">
				<input
					type="file"
					className="custom-file-input d-none"
					name="filename"
					id="imgin"
					onChange={onFileChange}
					accept="image/*"
				/>
				<label
					className={`w-100 custom-file-label ml-auto ${label.class}`}
					htmlFor="customFile"
					onClick={_ => $("#imgin").click()}>
					{label.name}
				</label>
			</div>

			<button
				type="button"
				className="btn btn-primary"
				onClick={createGroup}>
				Create Group
			</button>
		</form>
	)
}
