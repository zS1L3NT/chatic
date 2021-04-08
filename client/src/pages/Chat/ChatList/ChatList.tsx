import React, { useEffect, useState } from "react"
import { Flipper } from "react-flip-toolkit"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import ChatCard from "./ChatCard/ChatCard"
import "./ChatList.scss"
import Searchbar from "./Searchbar/Searchbar"

export default function ChatList() {
	// const [max, SETmax] = useState(false)
	const [isopen, SETisopen] = useState(false)

	const cids = useSelector(state => state.cids)
	const history = useHistory()

	useEffect(() => {
		// SETmax(false)
		/**
		 * TODO After Firebase Cloud Functions are unlocked
		 * When the scrollbar reaches the bottom
		 * if (already scrolled to max) {
		 *     Don't allow skeleton loading
		 * } else if (not scrolled below yet) {
		 *     Load 10 skeleton components
		 *     SETmax(true)
		 * }
		 */
	}, [cids])

	return (
		<aside className="chatlist">
			<div className="chatlist__header">
				<h3 className="chatlist__header__title">Chatic</h3>
				<Searchbar isopen={isopen} SETisopen={SETisopen} />
				<div className="chatlist__header__icons">
					<i
						className="chatlist__header__icon fa fa-plus"
						onClick={() =>
							history.push(`/chat/creategroup`)
						}
					/>
					<i
						className="chatlist__header__icon fa fa-sign-in-alt"
						onClick={() =>
							history.push(`/chat/joingroup`)
						}
					/>
					<i
						className="chatlist__header__icon fa fa-search"
						onClick={() => SETisopen(true)}
					/>
				</div>
			</div>
			<div className="chatlist__usercards">
				{/**
				 * cids is possible to be null so we must place UserCard skeletons
				 * when fetching cids from Firebase cloud function
				 */}
				{cids.length > 0 ? (
					<Flipper flipKey={cids.join("")}>
						{cids.map(cid => (
							<ChatCard cid={cid} key={cid} />
						))}
					</Flipper>
				) : (
					Array.from(Array(10).keys()).map(cid => (
						<ChatCard key={cid} />
					))
				)}
			</div>
		</aside>
	)
}
