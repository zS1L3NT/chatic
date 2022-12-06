import "@fortawesome/fontawesome-free/js/all.min.js"
import "animate.css/animate.min.css"
import AOS from "aos"
import "aos/dist/aos.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "font-awesome/css/font-awesome.min.css"
import "jquery/dist/jquery.min.js"
import "popper.js/dist/popper.min.js"
import React, { useEffect } from "react"
import { Provider } from "react-redux"
import { Route, Switch, useHistory } from "react-router-dom"
import socketIOClient from "socket.io-client"
import PNF from "./components/404"
import About from "./components/About"
import Account from "./components/Account"
import Chat from "./components/Chat"
import External from "./components/External"
import How from "./components/How"
import Login from "./components/Login"
import Logout from "./components/Logout"
import NavBar from "./components/NavBar"
import Register from "./components/Register"
import Response from "./components/Response"
import { GetUserData } from "./redux/actions/authActions"
import { setDesktop, setMobile } from "./redux/actions/browserActions"
import { clearErrors } from "./redux/actions/errorActions"
import store from "./redux/store"

export const socket = socketIOClient(
	[process.env.NODE_ENV === "production" ? "" : "http://localhost:5000"],
	{
		// WARNING: in that case, there is no fallback to long-polling
		transports: ["websocket"] // or [ 'websocket', 'polling' ], which is the same thing
	}
)

export const getDate = (extra = 0) => {
	var final = ""
	var d = new Date()
	var hour = d.getHours()
	var minutes = d.getMinutes()
	var ampm = "AM"
	var month = d.getMonth()
	var date = d.getDate()
	var seconds = d.getSeconds()

	// Hour config
	if (hour < 10) {
		hour = "0" + hour
	}
	if (hour > 12) {
		hour -= 12
		ampm = "PM"
	}
	final += hour

	// Add ':'
	final += ":"

	// Minute config
	if (minutes < 10) {
		minutes = "0" + minutes
	}
	final += minutes

	// Add ':'
	final += ":"

	// Seconds config
	if (extra !== 0) {
		seconds += extra
	}
	if (seconds < 10) {
		seconds = "0" + seconds
	}
	final += seconds
	if (hour === "12" && minutes === "00" && seconds === "00") {
		ampm = "NN"
	}
	if (hour === "00" && minutes === "00" && seconds === "00") {
		ampm = "MN"
	}

	// Add ampm
	final += " " + ampm

	// Add ' | '
	final += " | "

	// Month Config
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
	final += months[month]

	// Date config
	final += " " + date

	return final
}

const cloudinary = "https://res.cloudinary.com/chatbubble/image/upload/"

export default function App() {
	const history = useHistory()
	useEffect(_ => {
		store.dispatch(GetUserData())
	}, [])

	useEffect(_ => {
		if (window.location.host === "chat-bubblejs.herokuapp.com") {
			if (
				window.confirm(
					"Using default site. Redirect to new http://chat.bubblejs.com?"
				)
			) {
				window.location.href = "http://chat.bubblejs.com"
			}
		}
		// Mobile responsiveness
		if (matchMedia) {
			const mq = window.matchMedia("(max-width: 767px)")
			mq.addListener(WidthChange)
			WidthChange(mq)
		}
		function WidthChange(mq) {
			if (mq.matches) {
				store.dispatch(setMobile())
			} // width < 768 MOBILE
			else {
				store.dispatch(setDesktop())
			} // width >= 768px DESKTOP
		}
		AOS.init({
			duration: 600
		})
	}, [])

	const changePage = (to, open = false) => {
		if (store.getState().error.msg) store.dispatch(clearErrors())
		if (!open) return history.push(to)
		window.open(to)
	}

	return (
		<Provider store={store}>
			<NavBar change={changePage} />
			<Switch>
				<Route exact path="/" component={About} />
				<Route exact path="/how" component={How} />
				<Route exact path="/response">
					<Response cloudinary={cloudinary} changePage={changePage} />
				</Route>
				<Route exact path="/logout">
					<Logout
						cloudinary={cloudinary}
						changePage={changePage}
						socket={socket}
					/>
				</Route>
				<Route exact path="/login">
					<Login cloudinary={cloudinary} changePage={changePage} />
				</Route>
				<Route exact path="/register">
					<Register cloudinary={cloudinary} changePage={changePage} />
				</Route>
				<Route exact path="/chat">
					<Chat
						cloudinary={cloudinary}
						changePage={changePage}
						socket={socket}
						getDate={getDate}
					/>
				</Route>
				<Route exact path="/account">
					<Account cloudinary={cloudinary} changePage={changePage} />
				</Route>
				<Route exact path="/external">
					<External
						cloudinary={cloudinary}
						changePage={changePage}
						socket={socket}
					/>
				</Route>
				<Route exact path="*">
					<PNF cloudinary={cloudinary} changePage={changePage} />
				</Route>
			</Switch>
		</Provider>
	)
}
