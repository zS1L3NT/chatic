import React from "react"
import { useFadeState } from "../../../../../hooks/useFadeState"
import UserCard from "./UserCard/UserCard"

interface props {
	users: string[]
	admins: string[]
	cid: string
}

export default function ManageUsers(props: props) {
	const { users, admins, cid } = props

	const [response, SETresponse] = useFadeState()

	return (
		<>
			<hr />
			<h1 className="manage">Manage Users</h1>
			<div className="manage__users">
				{users.map(uid => (
					<UserCard
						key={uid}
						uid={uid}
						cid={cid}
						users={users}
						admins={admins}
						SETresponse={SETresponse}
					/>
				))}
			</div>
			{response.value ? (
				<p
					className="manage__invites__response"
					style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
		</>
	)
}
