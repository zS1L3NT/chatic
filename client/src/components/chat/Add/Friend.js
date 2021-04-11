import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import useState from "../../Hooks"
import {
	TransitionGroup as TG,
	CSSTransition as CT
} from "react-transition-group"
import { Input, Label } from "reactstrap"

export default function AddFriend(props) {
	const [phnm, SETphnm] = useState("", "[phnm]")
	const [response, SETresponse] = useState(
		{ usnm: "", pfp: "" },
		"[response]"
	)
	const [searching, SETsearching] = useState(false, "[searching]")
	const [button, SETbutton] = useState({ disabled: false, status: "Add" })
	const auth = useSelector(state => state.auth)
	const { socket } = props

	useEffect(_ => {
		socket.on("friend_found_user", response => {
			SETresponse(response)
			SETsearching(false)
			console.log(`>>> SocketIO on('friend_found_user')`)
		})
		socket.on("friend_no_user", _ => {
			SETresponse({ usnm: "", pfp: "" })
			SETsearching(false)
			console.log(`>>> SocketIO on('friend_no_user')`)
		})
		socket.on("added_friend", _ => {
			SETbutton({ ...button, status: "Success!" })
			socket.emit("bc-req refresh-list", response.usnm)
			setTimeout(_ => {
				SETbutton({ disabled: false, status: "Add" })
				SETresponse({ usnm: "", pfp: "" })
			}, 1000)
		})
		socket.on("already_friend", _ => {
			SETbutton({ ...button, status: "Already friends!" })
			setTimeout(_ => {
				SETbutton({ disabled: false, status: "Add" })
				SETresponse({ usnm: "", pfp: "" })
			}, 1000)
		})
		return _ => {
			socket.off("friend_found_user")
			socket.off("friend_no_user")
			socket.off("added_friend")
			socket.off("already_friend")
		}
	})

	const findUser = _ => {
		if (phnm === auth.user.phnm) return
		socket.emit("friend_search_user", phnm)
		SETsearching(true)
	}

	const addFriend = _ => {
		socket.emit("add_friend", [auth.user.usnm, response.usnm])
		SETbutton({ disabled: true, status: "Adding friend..." })
		SETphnm("")
	}

	return (
		<section
			className="form-group pb-0"
			style={{ padding: "20px", borderRadius: "15px" }}>
			<h3>Find a friend</h3>
			<hr />
			<div className="form-label-group d-flex">
				<Input
					name="phnm"
					type="text"
					id="phnm"
					placeholder="Type in their phone number..."
					style={{ height: "50px" }}
					className="bgcol-lg"
					onChange={e => {
						SETphnm(e.target.value)
						SETresponse({ usnm: "", pfp: "" })
					}}
					onKeyUp={e => (e.keyCode === 13 ? findUser() : null)}
					value={phnm}
				/>
				<Label for="phnm" style={{ userSelect: "none" }}>
					Type in their phone number...
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
							className="mt-3 p-2 d-flex"
							style={{
								backgroundColor: "lightblue",
								borderRadius: "15px"
							}}>
							<img
								src={`https://res.cloudinary.com/chatbubble/image/upload/${response.pfp}.png`}
								alt=""
								width="40"
								height="40"
								className="mx-2"
								style={{ borderRadius: "50%" }}
							/>
							<h4 className="mb-0 my-auto">
								{response.usnm || ""}
							</h4>
							<button
								onClick={addFriend}
								type="button"
								id="addBtn"
								className="btn btn-primary ml-auto"
								disabled={button.disabled}>
								{button.status}
							</button>
						</div>
					</CT>
				) : null}
			</TG>
		</section>
	)
}
