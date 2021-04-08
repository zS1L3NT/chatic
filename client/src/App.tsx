import AOS from "aos"
import "aos/dist/aos.css"
import firebase from "firebase/app"
import GetIP from "public-ip"
import React, { useEffect, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { useDispatch, useSelector } from "react-redux"
import { Route, Switch } from "react-router-dom"
import "./App.scss"
import Loading from "./components/Loading/Loading"
import Navigator from "./components/Navigator/Navigator"
import Firebase from "./Firebase"
import Functions from "./Functions"
import Active from "./pages/Active/Active"
import Chat from "./pages/Chat/Chat"
import Forgot from "./pages/Forgot/Forgot"
import Index from "./pages/Index/Index"
import Login from "./pages/Login/Login"
import Logout from "./pages/Logout/Logout"
import PageNotFound from "./pages/PageNotFound/PageNotFound"
import Register from "./pages/Register/Register"
import Settings from "./pages/Settings/Settings"
import { SetActive } from "./redux/actions/ActiveActions"
import { SetIPV4 } from "./redux/actions/IPV4Actions"
import { SetUID } from "./redux/actions/UIDActions"
import Repo from "./Repository"
import { IUser } from "./Types"

function App() {
	const [loading, SETloading] = useState(true)

	const dispatch = useDispatch()
	const reduxuid = useSelector(state => state.uid)

	useEffect(() => {
		if (window.location.hostname === "localhost") {
			localStorage.setItem("url", "http://localhost:2204")
		}
	}, [])

	/**
	 * & This runs upon app startup
	 */
	useEffect(() => {
		/**
		 * * Initialise AOS
		 */
		AOS.init({
			duration: 1500
		})

		/**
		 * * Set viewport for mobile devices to fit screen
		 */
		const meta = document.querySelector(
			"meta[name=viewport]"
		) as HTMLMetaElement | null
		if (!meta) throw new Error("Meta tag not found!")
		meta.setAttribute(
			"content",
			`${meta.content}, height=${window.outerHeight}, width=${window.outerWidth}`
		)

		/**
		 * * Set IPV4
		 */
		GetIP.v4().then(ipv4 => {
			dispatch(SetIPV4(ipv4))
		})

		/**
		 * ? If UID exists regardless of Firebase current
		 */
		Firebase.onAuthStateChanged(user => {
			SETloading(false)

			if (user) {
				dispatch(SetUID(user.uid))
				Functions.onAuthenticated(user.uid)
			} else {
				dispatch(SetUID(""))
			}
		})
	}, [dispatch])

	useEffect(() => {
		if (reduxuid)
			GetIP.v4().then(ipv4 => {
				Repo.user(reduxuid)
					.presenceIP(ipv4)
					.get(
						presenceIP => {
							dispatch(SetActive(presenceIP.isOnline))
						},
						() => {
							dispatch(SetActive(false))
						}
					)
			})
	}, [dispatch, reduxuid])

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<Navigator />
					<Switch>
						<Route exact path="/" component={Index} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/logout" component={Logout} />
						<Route exact path="/forgot" component={Forgot} />
						<Route exact path="/settings" component={Settings} />
						<Route path="/settings/:menu" component={Settings} />
						<Route exact path="/active" component={Active} />
						<Route exact path="/chat" component={Chat} />
						<Route exact path="/chat/~:cid" component={Chat} />
						<Route exact path="/chat/@:uid_" component={Chat} />
						<Route
							exact
							path="/chat/creategroup"
							component={Chat}
						/>
						<Route exact path="/chat/joingroup" component={Chat} />
						<Route
							exact
							path="/chat/joingroup/:iid"
							component={Chat}
						/>
						<Route exact path="*" component={PageNotFound} />
					</Switch>
				</>
			)}
		</>
	)
}

/**
 * ~ Promise to wait a few seconds in the code
 * @param ms Milliseconds to delay
 */
export const time = (ms: number) => new Promise(res => setTimeout(res, ms))

/**
 * Function to fade local article element into DOM
 */
export const FadeRedirect = () => {
	setTimeout(() => {
		const article = document.querySelector("article") as HTMLElement
		article.style.opacity = "1"
	}, 250)
}

/**
 * ~ Function that fades local article element out of the DOM.
 * ~ Then redirects you to your destined location.
 *
 * @param history History
 * @param location Location to redirect
 */
export const Redirect = (history: any, location: string) => {
	if (window.location.pathname !== location) {
		try {
			const article = document.querySelector("article") as HTMLElement
			article.style.opacity = "0"
			setTimeout(() => {
				history.push(location)
			}, 250)
		} catch (err) {
			throw new Error(
				"Custom component isn't sitting inside an <article> element"
			)
		}
	}
}

/**
 * ~ Returns difference between `new Date().getTime()` and `time given` in a fancy way
 * @param time Value of `new Date().getTime()`
 */
export const DateDiff = (time: number): string => {
	if (time > new Date().getTime())
		throw new Error("Date given is in the future!")

	const seconds = Math.floor((new Date().getTime() - time) / 1000)
	let unit = "second"

	/**
	 * Between 0 and 59 seconds
	 * Display as seconds
	 */
	if (seconds < 60) {
		return `${seconds} ${unit}${seconds !== 1 ? "s" : ""} ago`
	}

	const minutes = Math.floor(seconds / 60)
	unit = "minute"

	/**
	 * Between 1 and 59 minutes
	 * Display as minutes
	 */
	if (minutes < 60) {
		return `${minutes} ${unit}${minutes !== 1 ? "s" : ""} ago`
	}

	const hours = Math.floor(minutes / 60)
	unit = "hour"

	/**
	 * Between 1 and 23 hours
	 * Display as hours
	 */
	if (hours < 24) {
		return `${hours} ${unit}${hours !== 1 ? "s" : ""} ago`
	}

	const days = Math.floor(hours / 24)
	unit = "day"

	/**
	 * Between 1 and 30 days
	 * Display as days
	 */
	if (days <= 30) {
		return `${days} ${unit}${days !== 1 ? "s" : ""} ago`
	}

	return `More than a month ago`
}

export const mentionUsers = (
	text: string,
	you: string,
	users: { [uid: string]: IUser }
) => {
	// <!@WOpUCYGDOShjRhPmNOSsrx8snDv2>: Huh? <!@M598HyHeGEcSljsXlCnhfFe5yal1>
	if (text.startsWith(`<!@${you}>`)) text = text.replace(`<!@${you}>`, "You")
	const mentions = text.match(/<!@([\w\d]*)>/g)
	if (!mentions) return text

	for (let i = 0, il = mentions.length; i < il; i++) {
		const mention = mentions[i]
		const uid = mention.slice(3, -1)

		const user = users[uid]
		if (!user) text = text.replace(mention, "<unknown>")
		else text = text.replace(mention, user.usnm)
	}

	return text
}

export const getOtherDirectUser = (uids: string[], uid: string) => {
	if (uids.length !== 2) throw new Error("Direct chat has more than 2 users")
	return uids[0] === uid ? uids[1] : uids[0]
}

export const uploadToStorage = (
	storage: firebase.storage.Storage,
	path: string,
	data: string
) =>
	new Promise<string>(async (res, rej) => {
		let fetchRes
		try {
			fetchRes = await fetch(data)
		} catch {
			rej()
			return
		}

		const blob = await fetchRes.blob()

		const storageRef = storage.ref(`${path}.png`)
		await storageRef.put(blob)
		const url = await storageRef.getDownloadURL()
		URL.revokeObjectURL(data)
		res(url)
	})

export const ListDifference = (oldList: string[], newList: string[]) => ({
	added: (callback: (list: string[]) => void) => {
		const added: string[] = []
		for (let i = 0, il = newList.length; i < il; i++) {
			const newItem = newList[i]
			if (oldList.indexOf(newItem) === -1) added.push(newItem)
		}

		if (added.length > 0) callback(added)
		return ListDifference(oldList, newList)
	},
	removed: (callback: (list: string[]) => void) => {
		const removed: string[] = []
		for (let i = 0, il = oldList.length; i < il; i++) {
			const oldItem = oldList[i]
			if (newList.indexOf(oldItem) === -1) removed.push(oldItem)
		}

		if (removed.length > 0) callback(removed)
		return ListDifference(oldList, newList)
	}
})

export default App
