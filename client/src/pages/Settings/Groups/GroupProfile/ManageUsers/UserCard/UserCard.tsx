import React, { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useSelector } from "react-redux"
import Repo from "../../../../../../Repository"
import Functions from "../../../../../../Functions"
import { IUser } from "../../../../../../Types"
import AsyncImage from "../../../../../../components/AsyncImage/AsyncImage"
import ConfirmMenu from "../../../../../../components/ConfirmMenu/ConfirmMenu"
import "./UserCard.scss"

interface props {
	uid: string
	cid: string
	users: string[]
	admins: string[]
	SETresponse: (value: string) => void
}

export default function UserCard(props: props) {
	const { uid, cid, users, admins, SETresponse } = props
	const [user, SETuser] = useState<IUser>()
	const [access, SETaccess] = useState(false)

	const [cfm, SETcfm] = useState(false)

	const reduxuid = useSelector(state => state.uid)

	useEffect(() => {
		return Repo.user(uid).observe(SETuser, () =>
			console.error(`[UserCard.tsx] UID "${uid}" is in a group but doesnt exist???`)
		)
	}, [uid])

	useEffect(() => {
		SETaccess(admins.indexOf(reduxuid) >= 0)
	}, [admins, reduxuid])

	const remove = () => {
		if (cid === "welcome") return SETresponse("No one can leave welcome group! >:)")
		if (uid === reduxuid && admins.length === 1 && users.length > 1)
			return SETresponse("You can't leave the group without an admin!")
		Functions.removeFromChat(uid, cid)
	}

	return (
		<section className="usercard">
			<div className="usercard__start">
				<AsyncImage src={user?.pfp} className="usercard__start__pfp" />
				<h1 className="usercard__start__usnm">{user?.usnm || <Skeleton width={200} />}</h1>
			</div>
			<div className="usercard__end">
				<input
					className="usercard__end__input"
					id={`access__${uid}`}
					type="checkbox"
					disabled={!access || uid === reduxuid}
					checked={admins.indexOf(uid) >= 0}
					onChange={e => {
						Repo.chat(cid).update({
							admins: e.target.checked ? [...admins, uid] : admins.filter(id => id !== uid)
						})
					}}
				/>
				<label
					className={"usercard__end__label" + (!access || uid === reduxuid ? " disabled" : "")}
					htmlFor={`access__${uid}`}></label>

				<button
					className={"usercard__end__remove" + (!access && uid !== reduxuid ? " disabled" : "")}
					disabled={!access && uid !== reduxuid}
					type="button"
					onClick={() => SETcfm(true)}>
					{uid === reduxuid ? "Leave" : "Remove"}
				</button>
				{cfm && (
					<ConfirmMenu
						SETcfm={SETcfm}
						action={reduxuid === uid ? "leave this group" : "kick this user from the group"}
						trueMsg="Yes"
						falseMsg="No"
						onRes={res => res && remove()}
					/>
				)}
			</div>
		</section>
	)
}
