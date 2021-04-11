import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { changeChat } from "../../redux/actions/chatActions"
import useState from "../Hooks"
import { Input, Label } from "reactstrap"
import {
	TransitionGroup as TG,
	CSSTransition as CT
} from "react-transition-group"

const $ = document.querySelector.bind(document)

export default function EditChat(props) {
	const [phnm, setPhnm] = useState("", "[phnm]")
	const [response, SETresponse] = useState({ usnm: "", pfp: "" })
	const [searching, setSearching] = useState(false, "[searching]")
	const auth = useSelector(state => state.auth)
	const chat = useSelector(state => state.chat)
	const dispatch = useDispatch()
	const { open, list } = chat
	const { socket, refresh, cloudinary } = props

	const isGroup = open.match(/^\[/) && open !== ""
	const isChat = !open.match(/^\[/) && open !== ""

	const findUser = _ => {
		if (phnm !== auth.user.phnm) {
			socket.emit("edit-chat_search_user", phnm)
			setSearching(true)
		}
	}

	const phnmChange = e => {
		setPhnm(e.target.value)
		SETresponse({ usnm: "", pfp: "" })
	}

	const block = _ => {
		socket.emit("req_block-user", {
			current: auth.user.usnm,
			who: open
		})
	}

	const unblock = _ => {
		socket.emit("req_unblock-user", {
			current: auth.user.usnm,
			who: open
		})
	}

	const add = _ => {
		if (response.usnm in list[open].members)
			return SETresponse({ usnm: "", pfp: "" })
		socket.emit("req_join-group", {
			me: auth.user.usnm,
			who: response.usnm,
			group: open
		})
	}

	const leave = _ => {
		socket.emit("req_leave-group", {
			who: auth.user.usnm,
			group: open
		})
	}

	useEffect(_ => {
		socket.on("res_leave-group", group => {
			$("#closeEditChatModal").click()
			socket.emit("bc-req refresh-list")
			socket.emit("bc-req refresh-group", group)
			dispatch(changeChat("", auth.user.usnm))
			props.refresh()
			props.reqconv()
		})
		socket.on("res_join-group", group => {
			$("#closeEditChatModal").click()
			socket.emit("bc-req refresh-list")
			socket.emit("bc-req refresh-group", group)
			props.refresh()
			props.reqconv()
		})
		socket.on("edit-chat_found_user", res => {
			SETresponse(res)
			setSearching(false)
		})
		socket.on("edit-chat_no_user", _ => {
			SETresponse({ usnm: "", pfp: "" })
			setSearching(false)
		})
		socket.on("res_block-user", _ => {
			refresh()
			socket.emit("bc-req refresh-auth")
			$("#closeEditChatModal").click()
		})
		socket.on("res_unblock-user", _ => {
			refresh()
			socket.emit("bc-req refresh-auth")
			$("#closeEditChatModal").click()
		})
		return _ => {
			socket.off("res_leave-group")
			socket.off("res_join-group")
			socket.off("edit-chat_found_user")
			socket.off("edit-chat_no_user")
			socket.off("res_block-user")
			socket.off("res_unblock-user")
		}
	})

	return (
		<section
			className="modal fade"
			id="editChatModal"
			tabIndex="-1"
			role="dialog"
			aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">About Chat</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body" id="chatInfo">
						<div className="form-group d-flex">
							<img
								src={`${cloudinary}${
									list?.[open]?.pfp ||
									list?.[open]?.icon ||
									"ChatBot"
								}.png`}
								alt=""
								style={{ width: "20%", height: "20%" }}
							/>
							<h1 className="my-auto ml-3">{open}</h1>
						</div>
						{isGroup ? <hr /> : null}
						{isGroup
							? Object.keys(list[open].members).map(usnm =>
									!usnm.match(/^\{/) ? (
										<div className="d-flex my-2" key={usnm}>
											<img
												src={`${cloudinary}${list[open].members[usnm]}.png`}
												alt=""
												height="40"
												width="40"
												className="br-50"
											/>
											<h4 className="my-auto ml-2">
												{usnm}
												{usnm === auth.user.usnm
													? " (you)"
													: null}
											</h4>
										</div>
									) : null
							  )
							: null}
						{isGroup ? <hr /> : null}
						{isGroup ? (
							<div
								className="form-group pb-0"
								style={{
									padding: "20px",
									borderRadius: "15px"
								}}>
								<h3>Add to chat</h3>
								<hr />
								<div className="form-label-group d-flex">
									<Input
										name="phnm"
										type="text"
										id="add-phnm"
										placeholder="Type in their phone number..."
										style={{ height: "50px" }}
										onChange={phnmChange}
										className="bgcol-lg"
										onKeyUp={e =>
											e.keyCode === 13 ? findUser() : null
										}
										value={phnm}
									/>
									<Label
										for="add-phnm"
										style={{ userSelect: "none" }}>
										Type in their phone number...
									</Label>
									<div className="input-group-append">
										<button
											onClick={findUser}
											type="submit"
											className="btn btn-link">
											<i
												className={
													"color-lg fa fa-" +
													[
														searching
															? "spinner fa-spin"
															: "search"
													]
												}></i>
										</button>
									</div>
								</div>
								<TG>
									{response.usnm !== "" ? (
										<CT timeout={500} classNames="item">
											<div
												className="mt-3 p-2 d-flex"
												style={{
													backgroundColor:
														"lightblue",
													borderRadius: "15px"
												}}>
												<img
													src={`${cloudinary}${response.pfp}.png`}
													alt=""
													width="40"
													height="40"
													className="mx-2 br-50"
												/>
												<h4 className="mb-0 my-auto">
													{response.usnm || "default"}
												</h4>
												<button
													onClick={add}
													type="button"
													className="btn btn-primary ml-auto">
													Add
												</button>
											</div>
										</CT>
									) : null}
								</TG>
							</div>
						) : null}
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="d-none"
							id="closeEditChatModal"
							data-dismiss="modal"></button>
						{isChat ? (
							<button
								type="button"
								onClick={
									list?.[open]?.blocked ? unblock : block
								}
								className="btn btn-danger ml-auto"
								disabled={open === "ChatBot"}>
								{list?.[open]?.blocked ? "Unb" : "B"}lock User
							</button>
						) : (
							<button
								type="button"
								onClick={leave}
								className="btn btn-danger ml-auto">
								Leave Chat
							</button>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
