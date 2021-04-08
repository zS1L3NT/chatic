import React, { useState } from "react"
import Firebase from "../../../../Firebase"
import Repo from "../../../../Repository"
import { useFadeState } from "../../../../hooks/useFadeState"
import { IChat } from "../../../../Types"
import AsyncImage from "../../../../components/AsyncImage/AsyncImage"
import ButtonSpinner from "../../../../components/ButtonSpinner/ButtonSpinner"
import Input from "../../../../components/Input/Input"
import "./CreateGroup.scss"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import Functions from "../../../../Functions"
import ImageSelector from "../../../../components/ImageSelector/ImageSelector"
import { uploadToStorage } from "../../../../App"

export default function CreateGroup() {
	const [name, SETname] = useState("")
	const [icon, SETicon] = useState("")
	const [iconmenu, SETiconmenu] = useState(false)
	const [saving, SETsaving] = useState(false)
	const [response, SETresponse] = useFadeState()

	const reduxuid = useSelector(state => state.uid)
	const history = useHistory()
	const { storage } = Firebase

	const [cid] = useState(Repo.newChatID())

	const create = async () => {
		if (!name) return SETresponse("No name entered!")
		if (!icon) return SETresponse("No icon entered!")

		SETsaving(true)
		SETresponse("")

		let url
		try {
			url = await uploadToStorage(storage, `/${cid}/icon`, icon)
		} catch {
			url = icon
		}

		const chat: IChat = {
			cid,
			users: [],
			admins: [reduxuid],
			type: "group",
			name,
			icon: url,
			lastmsg: "",
			media: []
		}

		await Repo.chat(cid).set(chat)
		await Functions.addToChat(reduxuid, cid)

		SETsaving(false)
		SETresponse("Created!")
		history.push(`/chat/~${cid}`)
	}

	return (
		<section className="creategroup">
			<h1 className="creategroup__title">Create a group</h1>
			<AsyncImage src={icon} className="creategroup__icon" />
			<ImageSelector
				open={iconmenu}
				SETopen={SETiconmenu}
				SETres={SETicon}
			/>
			<button
				className="creategroup__icon__button"
				type="button"
				onClick={() => SETiconmenu(true)}>
				Change Group Icon
			</button>
			<Input
				value={name}
				label="Group Name"
				className="creategroup__name"
				autoComplete="false"
				onChange={e => SETname(e.target.value)}
			/>
			{response.value ? (
				<p
					className="creategroup__response"
					style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
			<ButtonSpinner saving={saving} onClick={create} text="Create" />
		</section>
	)
}
