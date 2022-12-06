import React from "react"
import useState from "../../Hooks"

import AddFriend from "./Friend"
import AddGroup from "./Group"

export default function AddChat(props) {
	const [render, setRender] = useState("start", "[render]")
	const { socket, refresh, cloudinary } = props

	const closeref = _ => {
		refresh()
		socket.emit("bc-req refresh-list")
	}

	const customBtn = {
		border: "none",
		outline: "none",
		background: "none",
		borderBottom: "1px solid lightgray",
		position: "sticky",
		width: "50%"
	}

	return (
		<section
			className="modal fade"
			id="addChatModal"
			tabIndex="-1"
			role="dialog"
			aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Add</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<div style={{ padding: "0 20px" }}>
							<div
								style={{
									height: "26px",
									width: "calc(50% - 40px + 4px)",
									animation:
										render !== "start"
											? `move${
													render === "friend"
														? "Left"
														: "Right"
											  } 1s forwards`
											: "none"
								}}
								className="bgcol-lg position-absolute"></div>
							<button
								type="button"
								onClick={_ => setRender("friend")}
								style={customBtn}
								id="friend">
								Add Friend
							</button>
							<button
								type="button"
								onClick={_ => setRender("group")}
								style={customBtn}
								id="group">
								Add Group
							</button>
						</div>
						<main>
							{render === "friend" || render === "start" ? (
								<AddFriend
									cloudinary={cloudinary}
									socket={socket}
								/>
							) : render === "group" ? (
								<AddGroup
									cloudinary={cloudinary}
									socket={socket}
									closeref={closeref}
								/>
							) : null}
						</main>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-danger"
							data-dismiss="modal"
							onClick={closeref}>
							Close and Refresh
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
