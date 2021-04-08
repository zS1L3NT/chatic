import React, { useEffect, useState } from "react"
import { uploadToStorage } from "../../../App"
import Firebase from "../../../Firebase"
import Repo from "../../../Repository"
import { useFadeState } from "../../../hooks/useFadeState"
import { IUser } from "../../../Types"
import AsyncImage from "../../../components/AsyncImage/AsyncImage"
import ButtonSpinner from "../../../components/ButtonSpinner/ButtonSpinner"
import ImageSelector from "../../../components/ImageSelector/ImageSelector"
import Input from "../../../components/Input/Input"
import "./Profile.scss"

interface props {
	user?: IUser
}

export default function Profile(props: props) {
	const { user } = props

	const [usnm, SETusnm] = useState("")
	const [pfp, SETpfp] = useState("")
	const [pfpmenu, SETpfpmenu] = useState(false)
	const [saving, SETsaving] = useState(false)
	const [response, SETresponse] = useFadeState()

	const { storage } = Firebase

	useEffect(() => {
		if (user) {
			SETusnm(user.usnm)
			SETpfp(user.pfp)
		}
	}, [user])

	const save = async (uid: string) => {
		if (!usnm) return SETresponse("Username is empty!")
		if (!pfp) return SETresponse("Profile picture is empty!")

		SETsaving(true)
		SETresponse("")

		await Repo.users()
			.where("usnm", "==", usnm)
			.get(async snap => {
				const docs = Object.values(snap.docs)
				if (docs.length > 0 && docs[0].id !== uid) {
					SETsaving(false)
					SETresponse("Username taken!")
					return
				}

				let url
				try {
					url = await uploadToStorage(storage, `/${uid}`, pfp)
				} catch {
					url = pfp
				}

				await Repo.user(uid).update({
					usnm,
					pfp: url
				})

				SETsaving(false)
				SETresponse("Saved!")
			})
	}

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(`http://chatic.zectan.com/chat/@${user?.uid}`)
			.then(() => alert("Copied link to clipboard!"))
			.catch(() => alert("Couldn't copy link to clipboard"))
	}

	return (
		<main className="profile">
			<AsyncImage src={pfp} className="profile__pfp" />
			<button className="profile__pfp__button" type="button" onClick={() => SETpfpmenu(true)}>
				Change Profile Picture
			</button>
			<ImageSelector open={pfpmenu} SETopen={SETpfpmenu} SETres={SETpfp} />
			<p className="profile__link">
				Send this link to friends so they can start chatting with you instantly! <br />
				<span onClick={copyToClipboard}>{`http://chatic.zectan.com/chat/@${user?.uid}`}</span>
			</p>
			<Input
				value={usnm}
				label="Username"
				active={user?.usnm === usnm}
				onChange={e => {
					SETusnm(e.target.value)
					SETresponse("")
				}}
				className="profile__usnm"
			/>
			{response.value ? (
				<p className="profile__response" style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
			<ButtonSpinner
				saving={saving}
				onClick={() => {
					if (user) save(user.uid)
				}}></ButtonSpinner>
		</main>
	)
}
