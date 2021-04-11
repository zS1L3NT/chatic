import React from "react"
import { useSelector } from "react-redux"
import useState from "./Hooks"
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	Container,
	NavbarBrand
} from "reactstrap"

const $ = document.querySelector.bind(document)

export default function NavBar(props) {
	const [isOpen, setIsOpen] = useState(false, "[isOpen]")
	const auth = useSelector(state => state.auth)
	const browser = useSelector(state => state.browser)
	const { change } = props

	const changePage = to => {
		change(to)
		setIsOpen(false)
	}

	const guestLinks = (
		<Nav className="ml-auto" navbar>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/how")}>
					Structure
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/")}>
					About
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/login")}>
					Login
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/register")}>
					Register
				</button>
			</NavItem>
		</Nav>
	)

	const authLinks = (
		<Nav className="ml-auto" navbar>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/how")}>
					Structure
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/")}>
					About
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/account")}>
					Account
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/chat")}>
					Chat
				</button>
			</NavItem>
			<NavItem>
				<button
					className={
						"btntoa nav-link" +
						[browser === "mobile" ? " fullBtn" : ""]
					}
					onClick={_ => changePage("/logout")}>
					Logout
				</button>
			</NavItem>
		</Nav>
	)

	const loader = (
		<div className="mr-2" style={{ width: "30px", height: "30px" }}>
			<div
				style={{
					// Positioning
					position: "absolute",

					// Decoration
					animation: "spinLoader 1s linear infinite",
					border: "5px solid #f3f3f3",
					borderTop: "5px solid #3498db",
					borderRadius: "50%",

					// Dimensions
					height: "30px",
					width: "30px"
				}}></div>
		</div>
	)

	const logo = (
		<img
			src="/icons/favicon.ico"
			className="mr-2"
			alt="logo"
			style={{
				height: "30px",
				width: "30px"
			}}></img>
	)

	if (auth.isLoading) {
		$("body").style.pointerEvents = "none"
		$("body").style.userSelect = "none"
	} else {
		$("body").style.pointerEvents = "auto"
		$("body").style.userSelect = "auto"
	}

	return (
		<Navbar expand="sm" light style={{ background: "#3293CF", zIndex: 2 }}>
			<Container>
				<NavbarBrand className="navbar-brand d-flex">
					{auth.isLoading ? loader : logo}
					<img src="./icons/chatbubble.png" alt="" height="30" />
				</NavbarBrand>
				<NavbarToggler
					onClick={_ => setIsOpen(!isOpen)}
					style={{ outline: "none" }}
				/>
				<Collapse isOpen={isOpen} navbar>
					{auth.isAuthenticated ? authLinks : guestLinks}
				</Collapse>
			</Container>
		</Navbar>
	)
}
