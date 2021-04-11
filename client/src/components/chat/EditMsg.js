import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import useState from "../Hooks"

const $ = document.querySelector.bind(document)

export default function EditMsg(props) {
	const { modal, setModal, socket } = props
	const { msg, date } = modal
	const [delDis, setDelDis] = useState(false, "[delDis]")
	const [saveDis, setSaveDis] = useState(false, "[saveDis]")
	const auth = useSelector(state => state.auth)
	const chat = useSelector(state => state.chat)
	const { open } = chat

	// req_conv
	const req_conv = (name = open) => {
		if (name !== "" && name !== "ChatBot" && name !== auth.user.usnm) {
			if (isChat(name)) {
				socket.emit("req_chat-conv", {
					current: auth.user.usnm,
					who: name
				})
			} else socket.emit("req_group-conv", name)
		}
	}

	// Test type
	const isChat = name => !name.match(/^\[/)
	const change = e => setModal({ ...modal, msg: e.target.value })

	const del = _ => {
		socket.emit("req_delete-msg", {
			date,
			sender: auth.user.usnm,
			chat: open
		})
		setDelDis(true)
	}

	const save = _ => {
		if (msg !== "") {
			socket.emit("req_save-msg", {
				msg,
				date,
				sender: auth.user.usnm,
				chat: open
			})
			setSaveDis(true)
		}
	}

	useEffect(_ => {
		socket.on("res_save-msg", _ => {
			if (open.match(/^\[/)) socket.emit("bc-req refresh-group", open)
			else socket.emit("bc-req refresh-chat", [auth.user.usnm, open])
			req_conv()
			setSaveDis(false)
			$("#closeEditMsgModal").click()
		})
		socket.on("res_delete-msg", _ => {
			if (open.match(/^\[/)) socket.emit("bc-req refresh-group", open)
			else socket.emit("bc-req refresh-chat", [auth.user.usnm, open])
			req_conv()
			setDelDis(false)
			$("#closeEditMsgModal").click()
		})
		return _ => {
			socket.off("res_save-msg")
			socket.off("res_delete-msg")
		}
	})

	return (
		<section
			className="modal fade"
			id="editMessageModal"
			tabIndex="-1"
			role="dialog"
			aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Edit Message</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<div className="form-group">
							<label htmlFor="msg">Edit message</label>
							<input
								type="text"
								className="form-control"
								onKeyUp={e =>
									e.keyCode === 13 ? save() : null
								}
								onChange={change}
								value={msg}
							/>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="d-none"
							id="closeEditMsgModal"
							data-dismiss="modal"></button>
						<button
							type="button"
							className="btn btn-danger mr-auto"
							onClick={del}
							disabled={delDis}>
							Delete Message
						</button>
						<button
							type="button"
							className="btn btn-success"
							onClick={save}
							disabled={saveDis}>
							Save Message
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
