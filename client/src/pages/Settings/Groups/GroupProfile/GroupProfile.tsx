import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { uploadToStorage } from "../../../../App"
import Repo from "../../../../Repository"
import { useFadeState } from "../../../../hooks/useFadeState"
import AsyncImage from "../../../../components/AsyncImage/AsyncImage"
import ButtonSpinner from "../../../../components/ButtonSpinner/ButtonSpinner"
import ImageSelector from "../../../../components/ImageSelector/ImageSelector"
import Input from "../../../../components/Input/Input"
import "./GroupProfile.scss"
import ManageInvites from "./ManageInvites/ManageInvites"
import ManageUsers from "./ManageUsers/ManageUsers"
import Firebase from "../../../../Firebase"

interface props {
	cid: string
}

export default function GroupProfile(props: props) {
	const { cid } = props
	const [access, SETaccess] = useState(false)
	const [name, SETname] = useState("")
	const [icon, SETicon] = useState("")
	const [iconmenu, SETiconmenu] = useState(false)
	const [saving, SETsaving] = useState(false)
	const [response, SETresponse] = useFadeState()
	const [users, SETusers] = useState<string[]>([])
	const [admins, SETadmins] = useState<string[]>([])

	const reduxuid = useSelector(state => state.uid)
	const history = useHistory()
	const { storage } = Firebase

	useEffect(() => {
		return Repo.chat(cid).observe(
			chat => {
				if (chat.users.indexOf(reduxuid) === -1) {
					history.push("/settings/groups")
					return
				}
				if (!name) SETname(chat.name)
				if (!icon) SETicon(chat.icon)
				SETusers(chat.users)
				SETadmins(chat.admins)
				SETaccess(chat.admins.indexOf(reduxuid) >= 0)
			},
			() => {
				console.warn(`[GroupProfile.tsx] CID "${cid}" does not exist`)
				history.push("/settings/groups")
			}
		)
	}, [history, reduxuid, cid, name, icon])

	const save = async () => {
		if (!name) return SETresponse("No name entered!")
		if (!icon) return SETresponse("No icon entered!")

		SETresponse("")
		SETsaving(true)

		let url
		try {
			url = await uploadToStorage(storage, `/${cid}/icon`, icon)
		} catch {
			url = icon
		}

		await Repo.chat(cid).update({
			name,
			icon: url
		})

		SETresponse("Saved!")
		SETsaving(false)
	}

	return (
		<section className="group_profile">
			<AsyncImage src={icon} className="group_profile__icon" />
			<button
				className={"group_profile__icon__button" + (!access ? " disabled" : "")}
				type="button"
				disabled={!access}
				onClick={() => SETiconmenu(true)}>
				Change Group Icon
			</button>
			<ImageSelector open={iconmenu} SETopen={SETiconmenu} SETres={SETicon} />
			<Input
				value={name}
				active={!!name}
				label="Group Name"
				disabled={!access}
				onChange={e => {
					if (access) SETname(e.target.value)
				}}
			/>
			{response.value ? (
				<p className="group_profile__response" style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
			{access ? <ButtonSpinner saving={saving} onClick={save} /> : <br />}
			<ManageInvites cid={cid} access={access} />
			<ManageUsers users={users} admins={admins} cid={cid} />
		</section>
	)
}
