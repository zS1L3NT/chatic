import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import useState from "./Hooks"

// Redux
import {
	listChats,
	updateChat,
	insertChat,
	changeChat,
	setRead,
	addUnread,
	setTyping,
	resetChatBot
} from "../redux/actions/chatActions"

// Components
import Users from "./chat/Users"
import Message from "./chat/Message"
import AddChat from "./chat/Add/Chat"
import EditMsg from "./chat/EditMsg"
import EditChat from "./chat/EditChat"
import { GetUserData } from "../redux/actions/authActions"

const $ = document.querySelector.bind(document)

export default function Chat(props) {
	const auth = useSelector(state => state.auth)
	const chat = useSelector(state => state.chat)
	const browser = useSelector(state => state.browser)
	const dispatch = useDispatch()
	const [online, setOnline] = useState([], "[online]")
	const [listLoad, setListLoad] = useState(true, "[listLoad]")
	const { changePage, socket, getDate, cloudinary } = props
	const { open, list, conversations } = chat

	// Login config
	useEffect(
		_ => {
			if (!auth.isAuthenticated) changePage("/login?fw=chat")
			if (!auth.user.verified) {
				dispatch(
					insertChat("ChatBot", {
						sender: "ChatBot",
						text: (
							<>
								Your account isn't verified. Go to your email to
								verify your account. Your chats will only load
								once your account is verified. Click
								<button
									onClick={_ =>
										socket.emit(
											"req_send-verification-email",
											{
												eml: auth.user.eml,
												_id: auth.user._id
											}
										)
									}
									type="button"
									className="btntoa">
									here
								</button>
								to resend the email if you didn't recieve it
							</>
						),
						date: getDate(1),
						status: "read"
					})
				)
			} else {
				requestChats()
				dispatch(resetChatBot())
				socket.emit("bc-req user-recieved", auth.user.usnm)
				socket.emit("set_online", auth.user.usnm)
			}
		},
		[auth.isAuthenticated, auth.user.verified]
	)

	// Test type
	const isGroup = name => name[0] === "["
	const isChat = name => name[0] !== "["

	// Scroll chat box
	const scroll = _ => ($("#msgs").scrollTop = $("#msgs").scrollHeight)

	// Send message
	const [msg, setMsg] = useState("", "[msg]")
	const sendMsg = _ => {
		if (!msg) return
		if (isGroup(open)) {
			socket.emit("send-group", {
				sender: auth.user.usnm,
				group: open,
				text: msg,
				date: getDate()
			})
		} else {
			socket.emit("send-chat", {
				sender: auth.user.usnm,
				reciever: open,
				text: msg,
				date: getDate()
			})
		}
		dispatch(
			insertChat(open, {
				sender: auth.user.usnm,
				reciever: open,
				text: msg,
				date: getDate(),
				status: "pending"
			})
		)
		setMsg("")
	}

	// Request list of chats
	const requestChats = _ => {
		setListLoad(true)
		socket.emit("req_chat-list", auth.user.usnm)
		socket.emit("bc-req user-recieved", auth.user.usnm)
	}

	// req_conv
	const req_conv = (name = open) => {
		if (name !== "" && name !== "ChatBot" && name !== auth.user.usnm) {
			if (isGroup(name)) return socket.emit("req_group-conv", name)
			socket.emit("req_chat-conv", { current: auth.user.usnm, who: name })
		}
	}

	// Message timer controller
	const [allow, setAllow] = useState(true, "[allow]")
	const msgController = _ => {
		if (allow) {
			sendMsg()
			setAllow(false)
			setTimeout(_ => setAllow(true), 1000)
		}
	}

	// Auto scroller
	const [scrollLock, setScrollLock] = useState(false, "[scrollLock]")
	useEffect(
		_ => {
			if (!scrollLock) scroll()
		},
		[conversations[open]]
	)

	// Online status manager
	useEffect(_ => {
		if (online.indexOf(auth.user.usnm) < 0)
			socket.emit("set_online", auth.user.usnm)
		socket.on("res_online", data => setOnline(data))
		socket.on("reset_online", _ =>
			socket.emit("set_online", auth.user.usnm)
		)
		return _ => {
			socket.off("res_online")
			socket.off("reset_online")
		}
	})

	// Typing status config
	const [yourTyping, setYourTyping] = useState(false, "[typing]")
	useEffect(
		_ => {
			if (open !== "ChatBot") {
				// If there is a messgae
				if (msg) {
					// If user previously wasn't typing
					if (!yourTyping) {
						setYourTyping(true)
						socket.emit("bc-req type-status", [
							auth.user.usnm,
							open,
							true
						])
					}
				} else {
					setYourTyping(false)
					socket.emit("bc-req type-status", [
						auth.user.usnm,
						open,
						false
					])
				}
			}
		},
		[msg]
	)

	// Browser config
	const [mobileDisp, setMobileDisp] = useState("chats", "[mobileDisp]")
	useEffect(
		_ => {
			if (browser === "desktop") {
				if (!open) dispatch(changeChat("ChatBot", auth.user.usnm))
				else req_conv()
			} else {
				if (!open) setMobileDisp("chats")
				else {
					setMobileDisp("conversations")
					req_conv()
				}
			}
		},
		[open, browser]
	)

	// Message box config
	const [msgbox, setmsgbox] = useState({
		placeholder: "Type a message...",
		disabled: false
	})
	useEffect(
		_ => {
			if (open === "ChatBot")
				setmsgbox({
					placeholder: "You cannot send messages to the ChatBot...",
					disabled: true
				})
			else if (open && isChat(open) && list[open].blocked)
				setmsgbox({
					placeholder: "User blocked. Text box disabled",
					disabled: true
				})
			else
				setmsgbox({ placeholder: "Type a message...", disabled: false })
		},
		[list, open]
	)

	// Converser status config
	const [status, setStatus] = useState("", "[status]")
	useEffect(
		_ => {
			if (list[open]) {
				if (auth.user.blockedBy.includes(open) || open.match(/^\[/))
					setStatus("")
				else if (list[open].typing) setStatus("Typing...")
				else if (online.includes(open)) setStatus("Online")
				else setStatus("")
			}
		},
		[list, auth.user.blockedBy]
	)

	// Chat sockets
	useEffect(_ => {
		socket.on("bc-res refresh-auth", _ => dispatch(GetUserData()))
		socket.on("res_send-verification-email", _ => {
			dispatch(
				insertChat("ChatBot", {
					sender: "ChatBot",
					text: "Email Sent! Check your inbox",
					date: getDate(5),
					status: "read"
				})
			)
		})
		socket.on("res_chat-list", data => {
			setListLoad(false)
			if (JSON.stringify(data) !== JSON.stringify(list))
				dispatch(listChats(data))
		})
		socket.on("res_chat-conv", data => {
			const { who, conv } = data
			if (
				JSON.stringify(conversations[who]) !== JSON.stringify(conv) &&
				conv.length >= (conversations[who]?.length || 0)
			) {
				dispatch(updateChat(who, conv))
				if (who === open) {
					socket.emit("bc-req set-chat-read", {
						reader: auth.user.usnm,
						sender: who
					})
					dispatch(setRead(who))
				}
			}
		})
		socket.on("res_group-conv", data => {
			const { group, conv } = data
			if (JSON.stringify(conversations[group]) !== JSON.stringify(conv)) {
				dispatch(updateChat(group, conv))
			}
		})
		socket.on("send-chat-success", reciever => {
			req_conv(reciever)
			socket.emit("bc-req refresh-chat", [auth.user.usnm, open])
		})
		socket.on("send-group-success", group => {
			req_conv(group)
			socket.emit("bc-req refresh-group", open)
		})
		socket.on("bc-res refresh-chat", data => {
			const [sender, reciever] = data
			// If the refresh request was meant for me
			if (reciever === auth.user.usnm) {
				req_conv(sender)
				socket.emit("bc-req user-recieved", auth.user.usnm)
				if (open !== sender) dispatch(addUnread(sender))
			}
		})
		socket.on("bc-res refresh-group", group => {
			if (group in list) {
				req_conv(group)
				console.log(`>>> Refreshed group ${group}`)
			}
		})
		socket.on("bc-res set-chat-read", user => {
			req_conv(user)
		})
		socket.on("bc-res user-recieved", user => {
			req_conv(user)
		})
		socket.on("bc-res type-status", data => {
			const [typer, reciever, status] = data
			if (reciever === auth.user.usnm) dispatch(setTyping(typer, status))
		})
		socket.on("bc-res refresh-list", _ => {
			requestChats()
		})
		return _ => {
			socket.off("bc-res refresh-auth")
			socket.off("res_send-verification-email")
			socket.off("res_chat-list")
			socket.off("res_chat-conv")
			socket.off("res_group-conv")
			socket.off("send-chat-success")
			socket.off("send-group-success")
			socket.off("bc-res refresh-chat")
			socket.off("bc-res refresh-group")
			socket.off("bc-res set-chat-read")
			socket.off("bc-res user-recieved")
			socket.off("bc-res type-status")
			socket.off("bc-res refresh-list")
		}
	})

	const [modal, setModal] = useState({ msg: "", date: "" }, "[modal]")
	if (browser === "desktop") {
		return (
			<article
				id="chatPage"
				style={{ height: "calc(100% -  56px - 6rem)" }}>
				<AddChat
					cloudinary={cloudinary}
					refresh={requestChats}
					socket={socket}
				/>
				<EditMsg modal={modal} setModal={setModal} socket={socket} />
				<EditChat
					cloudinary={cloudinary}
					socket={socket}
					refresh={requestChats}
					reqconv={req_conv}
				/>
				<link rel="stylesheet" src="Chat.css" />
				<div className="h-100 my-5 mx-auto col-9">
					<div className="d-flex h-100">
						<div className="col-4 px-0 h-100">
							<div className="bg-white h-100">
								<div
									className="px-4 d-flex bg-light"
									style={{ height: "55px" }}>
									<p className="h5 py-1 my-auto mr-auto">
										Recent
									</p>
									<button
										className="btntoa"
										title="Add a chat"
										data-toggle="modal"
										data-target="#addChatModal">
										<i className="fa fa-plus"></i>
									</button>
									<button
										className="btntoa ml-2"
										onClick={requestChats}
										title="Refresh list of chats">
										<i className="fa fa-sync"></i>
									</button>
								</div>
								<div className="messages-box">
									<Users
										cloudinary={cloudinary}
										online={online}
										listLoad={listLoad}
									/>
								</div>
							</div>
						</div>
						<div className="col-8 px-0 h-100">
							<div
								className="bg-white"
								style={{ height: "calc(100% - 48px)" }}>
								<div
									className="bg-light d-flex"
									style={{ padding: "10px" }}>
									<img
										src={`${cloudinary}${
											list?.[open]?.pfp ||
											list?.[open]?.icon ||
											"ChatBot"
										}.png`}
										alt=""
										style={{
											maxWidth: "35px",
											maxHeight: "35px"
										}}
										className="br-50"
									/>
									<div className="d-flex flex-column">
										<h6
											className="my-auto"
											style={{
												marginLeft: "10px",
												color: "#818182"
											}}>
											{open}
										</h6>
										<p
											className="mb-0"
											style={{
												fontSize: "11px",
												marginLeft: "10px"
											}}>
											{status}
										</p>
									</div>
									<button
										type="button"
										className="ml-auto mr-2"
										data-toggle="modal"
										data-target="#editChatModal"
										style={{
											background: 0,
											border: 0,
											outline: 0,
											boxShadow: 0
										}}>
										<i className="fa fa-ellipsis-v"></i>
									</button>
								</div>
								<div className="px-4 pt-3 chat-box" id="msgs">
									{auth.isAuthenticated && open
										? conversations[open].map((msg, i) => (
												<Message
													cloudinary={cloudinary}
													browser={browser}
													msg={msg}
													setModal={setModal}
													edited={msg.edited}
													key={msg.date}
													i={i}
												/>
										  ))
										: null}
								</div>
							</div>
							<form
								action="#?"
								className="bg-light"
								onSubmit={e => {
									e.preventDefault()
								}}>
								<div className="input-group">
									<div
										className="input-group-append"
										title="Scroll Lock">
										<button
											onClick={_ =>
												setScrollLock(!scrollLock)
											}
											type="button"
											className="btn btn-link">
											<i
												className="fa fa-lock"
												style={{
													color: [
														scrollLock
															? "rgb(0, 123, 255)"
															: "lightgray"
													]
												}}></i>
										</button>
									</div>
									<div
										className="input-group-append"
										title="Scroll to bottom">
										<button
											onClick={scroll}
											type="button"
											className="btn btn-link">
											<i
												className="fa fa-arrow-down"
												style={{
													color: "lightgray"
												}}></i>
										</button>
									</div>
									<input
										onChange={e => setMsg(e.target.value)}
										onKeyUp={e =>
											e.keyCode === 13
												? msgController()
												: null
										}
										name="msg"
										type="text"
										autoComplete="off"
										id="desktopMsgBox"
										className="form-control border-0 py-4 bg-light"
										value={msg}
										placeholder={msgbox.placeholder}
										disabled={msgbox.disabled}
									/>
									<div
										className="input-group-append"
										title="Send Message">
										<button
											onClick={msgController}
											id="desktopMsgBtn"
											type="button"
											className="btn btn-link">
											<i
												className="fa fa-paper-plane"
												style={{
													color: [
														msg
															? "rgb(0, 123, 255)"
															: "lightgray"
													]
												}}></i>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</article>
		)
	} else {
		return (
			<article
				id="chatPage"
				style={{ height: "calc(100% - 56px - 0.5rem)" }}>
				<AddChat
					cloudinary={cloudinary}
					refresh={requestChats}
					socket={socket}
				/>
				<EditMsg modal={modal} setModal={setModal} socket={socket} />
				<EditChat
					cloudinary={cloudinary}
					socket={socket}
					refresh={requestChats}
					reqconv={req_conv}
				/>
				<link rel="stylesheet" src="Chat.css" />
				<div className="h-100 m-1">
					<div
						style={{
							display: [mobileDisp === "chats" ? "block" : "none"]
						}}
						className="bg-white h-100">
						<div
							className="px-4 py-2 d-flex bg-light"
							style={{ height: "55px" }}>
							<p className="h5 mb-0 my-auto mr-auto ">Recent</p>
							<button
								className="btntoa"
								title="Add a chat"
								data-toggle="modal"
								data-target="#addChatModal">
								<i className="fa fa-plus"></i>
							</button>
							<button
								className="btntoa ml-2"
								onClick={requestChats}
								title="Refresh list of chats">
								<i className="fa fa-sync"></i>
							</button>
						</div>
						<div className="messages-box">
							<Users
								cloudinary={cloudinary}
								online={online}
								listLoad={listLoad}
							/>
						</div>
					</div>
					<div
						style={{
							display: [
								mobileDisp === "conversations"
									? "block"
									: "none"
							],
							height: "100%"
						}}
						className="px-0">
						<div
							className="bg-white"
							style={{ height: "calc(100% - 48px)" }}>
							<div
								className="bg-light d-flex"
								style={{ padding: "10px" }}>
								<button
									type="button"
									className="btntoa"
									onClick={_ =>
										dispatch(changeChat("", auth.user.usnm))
									}>
									<i className="fa fa-arrow-left my-auto mr-2"></i>
								</button>
								<img
									src={`${cloudinary}${
										list?.[open]?.pfp ||
										list?.[open]?.icon ||
										"ChatBot"
									}.png`}
									alt=""
									style={{
										maxWidth: "35px",
										maxHeight: "35px"
									}}
									className="br-50"
								/>
								<div className="d-flex flex-column">
									<h6
										className="my-auto"
										style={{
											marginLeft: "10px",
											color: "#818182"
										}}>
										{open}
									</h6>
									<p
										className="mb-0"
										style={{
											fontSize: "11px",
											marginLeft: "10px"
										}}>
										{status}
									</p>
								</div>
								<button
									type="button"
									className="ml-auto mr-2"
									data-toggle="modal"
									data-target="#editChatModal"
									style={{
										background: 0,
										border: 0,
										outline: 0,
										boxShadow: 0
									}}>
									<i className="fa fa-ellipsis-v"></i>
								</button>
							</div>
							<div className="chat-box" id="msgs">
								{auth.isAuthenticated && open
									? conversations[open].map((msg, i) => (
											<Message
												cloudinary={cloudinary}
												browser={browser}
												msg={msg}
												setModal={setModal}
												edited={msg.edited}
												key={msg.date}
												i={i}
											/>
									  ))
									: null}
							</div>
						</div>

						<form
							action="#?"
							className="bg-light"
							onSubmit={e => {
								e.preventDefault()
							}}>
							<div className="input-group">
								<div
									className="input-group-append"
									title="Scroll Lock">
									<button
										onClick={_ =>
											setScrollLock(!scrollLock)
										}
										type="button"
										className="btn btn-link">
										<i
											className="fa fa-lock"
											style={{
												color: [
													scrollLock
														? "rgb(0, 123, 255)"
														: "lightgray"
												]
											}}></i>
									</button>
								</div>
								<div
									className="input-group-append"
									title="Scroll to bottom">
									<button
										onClick={scroll}
										type="button"
										className="btn btn-link">
										<i
											className="fa fa-arrow-down"
											style={{ color: "lightgray" }}></i>
									</button>
								</div>
								<input
									onChange={e => setMsg(e.target.value)}
									onKeyUp={e =>
										e.keyCode === 13
											? msgController()
											: null
									}
									name="msg"
									type="text"
									autoComplete="off"
									id="mobileMsgBox"
									className="form-control border-0 py-4 bg-light"
									value={msg}
									placeholder={msgbox.placeholder}
									disabled={msgbox.disabled}
									onClick={() => setTimeout(scroll, 350)}
								/>
								<div
									className="input-group-append"
									title="Send Message">
									<button
										onClick={msgController}
										id="mobileMsgBtn"
										type="button"
										className="btn btn-link">
										<i
											className="fa fa-paper-plane"
											style={{
												color: [
													msg
														? "rgb(0, 123, 255)"
														: "lightgray"
												]
											}}></i>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</article>
		)
	}
}
