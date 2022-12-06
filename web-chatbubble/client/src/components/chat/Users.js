import React from "react"
import { useDispatch, useSelector } from "react-redux"

// Redux
import { changeChat, createConvState } from "../../redux/actions/chatActions"

export default function User(props) {
	const dispatch = useDispatch()
	const chat = useSelector(state => state.chat)
	const auth = useSelector(state => state.auth)
	const { cloudinary, online, listLoad } = props

	const { open, list, conversations } = chat

	const changeChatFunc = usnm => {
		if (!(usnm in conversations)) {
			dispatch(createConvState(usnm))
		}

		dispatch(changeChat(usnm, auth.user.usnm))
	}

	return (
		<aside id="userbox">
			{auth.isAuthenticated
				? Object.keys(list).map((key, i) => (
						<button
							onClick={_ => changeChatFunc(key)}
							type="button"
							key={key}
							className={
								"animate__animated animate__fadeInLeft btntoa list-group-item list-group-item-action " +
								[key === open ? "active text-white" : ""]
							}
							style={{ animationDelay: `${i * 150}ms` }}>
							<div className="media">
								<div style={{ width: "50px", height: "50px" }}>
									<img
										src={`${cloudinary}${
											list[key].pfp || list[key].icon
										}.png`}
										alt="user"
										className="rounded-circle mw-100 mh-100"
									/>
									{!key.match(/^\[/) ? (
										<div
											className="ml-auto br-50 position-relative"
											style={{
												width: "12px",
												height: "12px",
												backgroundColor: [
													online.includes(key) &&
													!auth.user.blockedBy.includes(
														key
													)
														? "#0CC041"
														: "#DADADA"
												],
												marginTop: "-12px",
												zIndex: "2"
											}}></div>
									) : null}
								</div>

								<div className="media-body ml-4 my-auto">
									<div className="d-flex align-items-center justify-content-between mb-1">
										<h6 className="mb-0">{key}</h6>
									</div>
									<p className="font-italic mb-0 text-small">
										{!key.match(/^\[/)
											? list[key].typing
												? "Typing..."
												: list[key].data
											: `${
													Object.keys(
														list[key].members
													).filter(
														usnm =>
															!usnm.match(/^\{/)
													).length
											  } member(s)`}
									</p>
								</div>
								<div
									className="my-auto text-center br-50"
									style={{
										display: [
											list[key].unread !== 0
												? "block"
												: "none"
										],
										backgroundColor: "rgb(0, 123, 255)",
										width: "24px",
										textAlign: "center",
										color: "white"
									}}>
									{list[key].unread}
								</div>
							</div>
						</button>
				  ))
				: null}
			{auth.isAuthenticated && listLoad ? (
				<div className="mx-auto mt-3" style={{ width: "fit-content" }}>
					<i className="fa fa-2x fa-spinner fa-spin"></i>
				</div>
			) : null}
		</aside>
	)
}
