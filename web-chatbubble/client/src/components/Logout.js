import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../redux/actions/authActions"

export default function Logout(props) {
	const dispatch = useDispatch()
	const { socket, changePage } = props

	useEffect(
		_ => {
			dispatch(logout())
			socket.emit("logout")
			changePage("/")
		},
		[changePage, dispatch, socket]
	)

	return <></>
}
