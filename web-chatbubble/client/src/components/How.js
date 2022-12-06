import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import useState from "./Hooks"

const GCS = window.getComputedStyle
const on = window.addEventListener
const off = window.removeEventListener

export default function How() {
	const aside = useRef(null)
	const browser = useSelector(state => state.browser)
	const [ml, SETml] = useState(0, "[ml]")
	const [uiiu, SETuiiu] = useState("UI!", "[uiiu]")
	const [mve, SETmve] = useState("", "[mve]")

	const changeMVE = _ => {
		let clientRect = null
		let clientRectTop = 0
		let maxVisibleHeight = 0
		let visibleHeightOfElem = 0
		let mostVisibleElement = null
		let skipRest = false

		for (const element of document.getElementsByClassName("vsble")) {
			if (!skipRest) {
				clientRect = element.getBoundingClientRect()
				clientRectTop = Math.abs(clientRect.top)

				if (clientRect.top >= 0)
					visibleHeightOfElem = window.innerHeight - clientRectTop
				else visibleHeightOfElem = clientRect.height - clientRectTop

				if (visibleHeightOfElem >= clientRect.height) {
					mostVisibleElement = element
					skipRest = true
				} else if (visibleHeightOfElem > maxVisibleHeight) {
					maxVisibleHeight = visibleHeightOfElem
					mostVisibleElement = element
				}
			}
		}
		SETmve(mostVisibleElement.id)
	}
	const changeML = _ => SETml(GCS(aside.current).width)

	useEffect(_ => {
		on("resize", changeML)
		on("scroll", changeMVE)
		changeML()
		changeMVE()
		return _ => {
			off("resize", changeML)
			off("scroll", changeMVE)
		}
	}, [])

	const button = id => {
		if (mve === id) {
			return {
				fontSize: "19px",
				color: "#007BFF"
			}
		}
		return {
			fontSize: "16px"
		}
	}

	return (
		<article id="howPage" style={{ marginTop: "40px" }}>
			<div className="container">
				<div className="row">
					<div className="d-flex">
						<aside
							className={
								"position-fixed col-md-2" +
								[browser === "mobile" ? " d-none" : ""]
							}
							ref={aside}>
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
									style={{ width: "100%", maxWidth: "240px" }}
								/>
							</div>
							<ul style={{ listStyle: "none", padding: 0 }}>
								<li>
									<a
										className="sidebtn"
										href="#tech"
										style={button("tech")}>
										{mve === "tech" ? "-" : ""} Technologies
									</a>
								</li>
								<li>
									<a
										className="sidebtn"
										href="#bovv"
										style={button("bovv")}>
										{mve === "bovv" ? "-" : ""} Brief
										Overview
									</a>
								</li>
								<li>
									<a
										className="sidebtn"
										href="#msgst"
										style={button("msgst")}>
										{mve === "msgst" ? "-" : ""} Message
										statuses
									</a>
								</li>
							</ul>
						</aside>
						<main
							className={
								browser === "desktop" ? "col-md-10" : "mx-3"
							}
							id="howPageMain"
							style={{ marginLeft: ml }}>
							<div className="vsble" id="tech">
								<h1>Technologies used</h1>
								<h4>Main Technologies</h4>
								<ul>
									<li>
										<b>MongoDB</b> as the Database
									</li>
									<li>
										<b>ExpressJS</b> as the BackEnd
										Framework
									</li>
									<li>
										<b>ReactJS</b> as the FrontEnd Library
									</li>
									<li>
										<b>NodeJS</b> as the BackEnd Language
									</li>
									<li>
										<b>Git</b> for version control
									</li>
									<li>
										<b>GitHub</b> for storing WebCode online
									</li>
									<li>
										<b>Heroku</b> for WebHosting and Website
										Domain
									</li>
								</ul>
								<h4>HTML Imports</h4>
								<ul>
									<li>
										<b>Handlee</b> font
									</li>
									<li>
										<b>Bootstrap.css</b>
									</li>
									<li>
										<b>FontAwesome.css</b>
									</li>
									<li>
										<b>Animate.css</b>
									</li>
									<li>
										<b>AnimateOnScroll.css</b>
									</li>
									<li>
										<b>Bootstrap.js</b>
									</li>
									<li>
										<b>FontAwesome.js</b>
									</li>
									<li>
										<b>Popper.js</b>
									</li>
									<li>
										<b>jQuery.js</b>
									</li>
								</ul>
								<h4>FrontEnd ReactJS External Packages</h4>
								<ul>
									<li>
										<b>Animate on Scroll (aos)</b> for
										special animations
									</li>
									<li>
										<b>Axios (axios)</b> for BackEnd
										communication
									</li>
									<li>
										<b>React (react)</b> for the FrontEnd
										Library
									</li>
									<li>
										<b>ReactDOM (react-dom)</b> for
										rendering the React components
									</li>
									<li>
										<b>React Redux (react-redux)</b> for
										connection between State and React
										components
									</li>
									<li>
										<b>
											React Router DOM (react-router-dom)
										</b>{" "}
										for rendering different pages
									</li>
									<li>
										<b>React Scripts (react-scripts)</b> for
										compiling the React Website
									</li>
									<li>
										<b>
											React Transition Group
											(react-transition-group)
										</b>{" "}
										for animations
									</li>
									<li>
										<b>React-Strap (reactstrap)</b> for
										integration with Bootstrap
									</li>
									<li>
										<b>Redux (redux)</b> for State
										Management
									</li>
									<li>
										<b>
											Redux DevTools Extension
											(redux-devtools-extension)
										</b>{" "}
										for Redux development
									</li>
									<li>
										<b>Redux Thunk (redux-thunk)</b> for
										simpler use of Redux
									</li>
									<li>
										<b>
											SocketIO Client (socket.io-client)
										</b>{" "}
										for managing the Chat from the FrontEnd
									</li>
								</ul>
								<h4>BackEnd NodeJS External Packages</h4>
								<ul>
									<li>
										<b>Bcrypt (bcryptjs)</b> for password
										Encryption
									</li>
									<li>
										<b>Cloudinary (cloudinary)</b> for
										online file upload API
									</li>
									<li>
										<b>Colors (colors)</b> for console
										colouring
									</li>
									<li>
										<b>Config (config)</b> for private data
										management
									</li>
									<li>
										<b>ExpressJS (express)</b> for the
										BackEnd Framework
									</li>
									<li>
										<b>JSON Web Token (jsonwebtoken)</b> for
										Authentication
									</li>
									<li>
										<b>MongoDB (mongodb)</b> for Dynamic
										Database Connection
									</li>
									<li>
										<b>Node Mailer (nodemailer)</b> for
										sending emails
									</li>
									<li>
										<b>SocketIO (socket.io)</b> for managing
										the Chat from the BackEnd
									</li>
								</ul>
							</div>
							<div className="vsble" id="bovv">
								<h1>Brief Overview</h1>
								<p>
									This chat website was built with SocketIO
									and based on <i>Request</i> and{" "}
									<i>Response</i>. When the 'Chat' page is
									rendered, SocketIO Client will emit{" "}
									<b>req_chat-list </b>
									which gets the list of past users that you
									have conversed with. SocketIO Server will
									then emit back <b>res_chat-list </b>and we
									can then display all your chats for you.
								</p>
								<p>
									Upon opening a chat, SocketIO Client will
									emit <b>req_conversation </b> which gets the
									chat history with whichever user you clicked
									on. SocketIO Server will then emit back{" "}
									<b>res_conversation </b> and then we will
									display the chats for you with our
									<button
										className="btntoa p-0 pl-1"
										onClick={_ => SETuiiu("IU :)")}
										style={{
											color: "black",
											textDecoration: "none"
										}}>
										<i>Beautiful </i> {uiiu}
									</button>
								</p>
								<p>
									When you send a message, SocketIO Client
									will emit <b>req_send-msg </b> which updates
									the DataBase (MongoDB) with the new message,
									then SocketIO Server will emit back
									<b> res_send-msg </b> and SocketIO Client
									will then{" "}
									<b>
										<i>BroadCast</i>{" "}
									</b>{" "}
									to the recieving user to tell them to
									refresh their chat
								</p>
								<p>
									However, this is just the extremely raw
									version of how this Chat works
									<br />
									<br />
								</p>
							</div>
							<div className="vsble" id="msgst">
								<h1>Message Statuses</h1>
								<p className="mb-0">
									Managing message statuses is not very
									difficult. It just requires a lot of
									communication between different Clients and
									the Server. There are four message statuses.
								</p>
								<ul>
									<li>
										<img
											alt="pending"
											src="./icons/pending.svg"
										/>
										&nbsp;<b>Pending</b>: Message is being
										sent and being added to the database
									</li>
									<li>
										<img
											alt="sent"
											src="./icons/sent.svg"
										/>
										&nbsp;<b>Sent</b>: Message sent but
										other user hasn't logged on
									</li>
									<li>
										<img
											alt="recieved"
											src="./icons/recieved.svg"
										/>
										&nbsp;<b>Recieved</b>: Other user has
										logged on and recieved the message in
										their inbox
									</li>
									<li>
										<img
											alt="read"
											src="./icons/read.svg"
										/>
										&nbsp;<b>Read</b>: Other user has read
										your sent message
									</li>
									<li>
										<img
											alt="blocked"
											src="./icons/blocked.svg"
										/>
										&nbsp;<b>Blocked</b>: Other user didn't
										recieve your message because he blocked
										you
									</li>
								</ul>
								<p>
									When you click the send button on the front
									end, Redux adds the new message into the
									chat with the status of <b>pending</b> to
									indicate the server is going to send the
									message and SocketIO Client will emit{" "}
									<b>req_send-msg</b> with the status of{" "}
									<b>sent</b>. SocketIO Server will then emit
									back <b>res_send-msg </b>and we can then
									refresh the conversation for you with the
									new message status of <b>sent</b>
								</p>
								<p className="mb-0">
									When handling the recieved tick, there are
									three cases for which SocketIO Client will
									<b>
										<i>BroadCast</i>
									</b>{" "}
									to all users that you have recieved all
									messages.
								</p>
								<ol>
									<li>
										When you render the Chat page: This
										shows that the user has logged in and
										recieved all messages meant for him
									</li>
									<li>
										When another client asks you to refresh
										your chat: To show that you have
										instanty recieved their message if they
										send you a message if you are online
									</li>
									<li>
										When you refresh your list of chats:
										Just in case of errors
									</li>
								</ol>
								<p>
									If the current user recieves a SocketIO{" "}
									<b>
										<i>BroadCast</i>
									</b>{" "}
									saying that someone recieved all messages,
									we will get your conversation with that
									person for you.
								</p>
								<p>
									The only case when SocketIO will{" "}
									<b>
										<i>BroadCast</i>
									</b>{" "}
									that you've read all messages is when your
									chat is open to a specific user. This way
									when the user tells you to refresh your
									chat, you will emit back to that user that
									you have refresh your chat and then all
									messages in the chat will be set as read
								</p>
								<p>
									If the other user blocks you, he won't
									refresh his chat when you{" "}
									<b>
										<i>BroadCast </i>
									</b>
									that you've sent a message neither will he
									load your messages. Your blocked messages
									will take on a status of <b>blocked</b> and
									therefore the user won't render them.
								</p>
							</div>
						</main>
					</div>
				</div>
			</div>
		</article>
	)
}
