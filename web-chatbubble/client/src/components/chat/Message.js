import React from "react"
import { useSelector } from "react-redux"

export default function Message(props) {
	const auth = useSelector(state => state.auth)
	const chat = useSelector(state => state.chat)
	const {
		browser,
		cloudinary,
		setModal,
		msg: { text: msg, status, edited, sender, date }
	} = props
	const { list, open } = chat
	let type = "recieved"

	if (sender === "[ChatBot]") type = "bot"
	else if (sender === auth.user.usnm) type = "sent"

	if (type === "recieved" && status === "blocked") return <></>
	else if (type === "sent") {
		return (
			<div
				className="media ml-auto my-2 px-4 animate__animated animate__fadeInRight"
				style={{
					wordBreak: "break-word",
					width: [browser === "desktop" ? "70%" : "85%"]
				}}>
				<div className="media-body mr-3">
					<div className="bg-primary rounded py-2 px-3 mb-2">
						<p className="text-small mb-0 text-white">
							{msg || (
								<>
									<i className="fa fa-ban mr-2"></i>
									<i>Message deleted...</i>
								</>
							)}
						</p>
					</div>
					<div className="d-flex justify-content-between">
						<p className="small text-muted text-right ml-auto">
							<span title="Number of times the message was edited">
								{edited && msg ? `(${edited}) ` : null}
							</span>
							{date}
						</p>
						{!open.match(/^\[/) ? (
							<img
								className="ml-1"
								src={`./icons/${status}.svg`}
								alt=""
								width="20"
								height="20"
								title={status}
							/>
						) : null}
						{msg ? (
							<button
								type="button"
								className="p-0 px-1 mx-1"
								data-toggle="modal"
								data-target="#editMessageModal"
								style={{
									lineHeight: "normal",
									fontSize: "13.3333px",
									height: "19.2px",
									border: "0",
									outline: "0"
								}}
								onClick={_ => setModal({ msg, date })}>
								<i className="fa fa-ellipsis-h"></i>
							</button>
						) : null}
					</div>
				</div>
				<img
					src={`${cloudinary}${auth.user.pfp}.png`}
					alt="pfp"
					className="rounded-circle mw-50 mh-50"
				/>
			</div>
		)
	} else if (type === "recieved") {
		return (
			<div
				className="media my-2 px-4 animate__animated animate__fadeInLeft"
				style={{
					wordBreak: "break-word",
					width: [browser === "desktop" ? "70%" : "85%"]
				}}>
				<img
					src={`${cloudinary}${
						open.match(/^\[/)
							? list?.[sender]?.pfp || "ChatBot"
							: list?.[open]?.pfp || "ChatBot"
					}.png`}
					alt="pfp"
					className="rounded-circle mw-50 mh-50"
				/>
				<div className="media-body ml-3">
					<div className="bg-light rounded py-2 px-3 mb-2">
						<p className="text-small mb-0 text-muted">
							{msg || (
								<>
									<i className="fa fa-ban mr-2"></i>
									<i>Message deleted...</i>
								</>
							)}
						</p>
					</div>
					<p className="small text-muted">
						{!open.match(/^\[/) ? null : sender in
						  list[open].members ? (
							`(${sender})`
						) : (
							<del>({sender})</del>
						)}
						&nbsp;
						{date}
						<span title="Number of times the message was edited">
							{edited && msg ? ` (${edited})` : null}
						</span>
					</p>
				</div>
			</div>
		)
	} else if (type === "bot") {
		return (
			<p
				className={`animate__animated animate__fadeInUp text-center mx-auto px-2 bg-${status}`}
				style={{ borderRadius: "25px", width: "fit-content" }}>
				{msg}
			</p>
		)
	}
}
