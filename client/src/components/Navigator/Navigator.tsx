import { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { Redirect } from "../../App"
import logo from "../../assets/images/logo.png"
import Firebase from "../../Firebase"
import "./Navigator.scss"

export default function Navigator() {
	const [show, SETshow] = useState(false)
	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)
	const history = useHistory()
	const location = useLocation()

	/**
	 * Function that runs after clicking a link in the navigator
	 * @param link URL
	 */
	const onClick = (link: link) => {
		if (link.href.startsWith("/chat")) {
			history.push(link.href)
		} else {
			Redirect(history, link.href)
		}
		SETshow(!show)
	}

	interface link {
		href: string
		text: string
		authState: boolean | null
	}

	const links: link[] = [
		{
			href: "/",
			text: "Home",
			authState: null
		},
		{
			href: "/chat",
			text: "Chat",
			authState: true
		},
		{
			href: "/settings",
			text: "Settings",
			authState: true
		},
		{
			href: "/login",
			text: "Login",
			authState: false
		},
		{
			href: "/register",
			text: "Register",
			authState: false
		},
		{
			href: "/logout",
			text: "Logout",
			authState: true
		}
	]

	/**
	 * Get links that are allowed to be displayed in navigator depending on authentication state
	 */
	const getActiveLinks = (): link[] => {
		const activeLinks: link[] = []

		for (let i = 0; i < links.length; i++) {
			const link = links[i]
			if (
				link.authState === !!Firebase.isAuth() ||
				link.authState === null
			) {
				activeLinks.push(link)
			}
		}

		return activeLinks
	}

	return (
		<header
			className="navigator"
			data-aos="fade-right"
			data-aos-once="true">
			<div
				className={"navigator__button" + (show ? " close" : "")}
				onClick={() => SETshow(!show)}>
				<div className="navigator__button__line"></div>
				<div className="navigator__button__line"></div>
				<div className="navigator__button__line"></div>
			</div>

			<nav className={"navigator__menu" + [show ? " show" : ""]}>
				<div
					className={
						"navigator__menu__branding" + [show ? " show" : ""]
					}>
					<img
						src={listeners.users?.[reduxuid]?.pfp || logo}
						alt="Profile"
						className="navigator__menu__branding__portrait"
					/>
				</div>
				<ul className={"navigator__menu__nav" + [show ? " show" : ""]}>
					{getActiveLinks().map(link => (
						<li
							key={link.href}
							className={
								"navigator__menu__nav__item" +
								[show ? " show" : ""] +
								[
									location.pathname === link.href
										|| (location.pathname.startsWith("/chat")
										&& link.href.startsWith("/chat"))
										|| (location.pathname.startsWith("/settings")
										&& link.href.startsWith("/settings"))
										? " current"
										: ""

								]
							}>
							<button
								className="navigator__menu__nav__link"
								id={link.href.slice(1) + "_btn"}
								onClick={() => onClick(link)}>
								{link.text}
							</button>
						</li>
					))}
				</ul>
			</nav>
		</header>
	)
}
