import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import Firebase from "../../../Firebase"
import { useFadeState } from "../../../hooks/useFadeState"
import { IUser } from "../../../Types"
import AnchorButton from "../../../components/AnchorButton/AnchorButton"
import AsyncImage from "../../../components/AsyncImage/AsyncImage"
import ButtonSpinner from "../../../components/ButtonSpinner/ButtonSpinner"
import Input from "../../../components/Input/Input"
import "./Security.scss"

interface props {
	user?: IUser
}

export default function Security(props: props) {
	const { user } = props
	const [cpswd, SETcpswd] = useState("")
	const [npswd, SETnpswd] = useState("")
	const [cfnpswd, SETcfnpswd] = useState("")
	const [saving, SETsaving] = useState(false)
	const [response, SETresponse] = useFadeState()

	const history = useHistory()

	const save = async (eml: string) => {
		if (!cpswd) return SETresponse("Current password is empty!")
		if (!npswd) return SETresponse("New password is empty!")
		if (npswd !== cfnpswd) return SETresponse("New passwords do not match!")
		if (npswd.length < 8)
			return SETresponse("New Password must be at least 8 characters!")

		SETresponse("")
		SETsaving(true)

		const pswdIsCorrect = await Firebase.CheckPassword(eml, cpswd)
		if (!pswdIsCorrect) {
			SETresponse("Current password is incorrect!")
			return SETsaving(false)
		}

		await Firebase.ResetPassword(npswd)
		SETresponse("Saved")
		SETsaving(false)
	}

	return (
		<main className="security">
			<AsyncImage
				src="https://cdn4.iconfinder.com/data/icons/business-2-62/50/107-512.png"
				className="security__img"
			/>
			<p className="security__socialreset">
				If you logged in with your Google account and want to set an
				Email-Password login, you need to set a password with your email{" "}
				<AnchorButton onClick={() => history.push("/forgot")}>
					here
				</AnchorButton>
			</p>
			<Input
				value={cpswd}
				type="password"
				label="Current Password"
				onChange={e => SETcpswd(e.target.value)}
				className="security__cpswd"
			/>
			<Input
				value={npswd}
				type="password"
				label="New Password"
				onChange={e => SETnpswd(e.target.value)}
				className="security__npswd"
			/>
			<Input
				value={cfnpswd}
				type="password"
				label="Confirm New Password"
				onChange={e => SETcfnpswd(e.target.value)}
				className="security__cfnpswd"
			/>
			{response.value ? (
				<p
					className="security__response"
					style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
			<ButtonSpinner
				saving={saving}
				onClick={() => {
					if (user) save(user.eml)
				}}></ButtonSpinner>
		</main>
	)
}
