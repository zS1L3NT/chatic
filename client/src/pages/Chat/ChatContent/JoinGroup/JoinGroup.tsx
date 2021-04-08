import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Functions from "../../../../Functions"
import { useFadeState } from "../../../../hooks/useFadeState"
import ButtonSpinner from "../../../../components/ButtonSpinner/ButtonSpinner"
import Input from "../../../../components/Input/Input"
import "./JoinGroup.scss"
import Repo from "../../../../Repository"
import firebase from "firebase/app"

interface props {
	iid?: string
}

export default function JoinGroup(props: props) {
	const [iid, SETiid] = useState("")
	const [saving, SETsaving] = useState(false)
	const [response, SETresponse] = useFadeState()

	const reduxuid = useSelector(state => state.uid)

	const join = useCallback(() => {
		if (!iid) return SETresponse("No chat ID entered!")
		SETsaving(true)

		Repo.invite(iid).get(
			invite => {
				if (invite.expires < new Date().getTime()) {
					SETresponse("Invite link expired!")
					SETsaving(false)
					return
				}
				if (!invite.uses) {
					SETresponse(
						"Invite link has let too many people into the chat!!"
					)
					SETsaving(false)
					return
				}

				Repo.user(reduxuid).get(
					async user => {
						if (user.chatorder.indexOf(invite.cid) >= 0) {
							SETresponse("You are already in this chat!")
							SETsaving(false)
							return
						}

						await Repo.invite(iid).update({
							uses: firebase.firestore.FieldValue.increment(-1)
						})
						await Functions.addToChat(reduxuid, invite.cid)
						SETresponse("Added!")
						SETsaving(false)
					},
					() => {
						console.error(
							`[JoinGroup.tsx] No chat order found for ${reduxuid}???`
						)
					}
				)
			},
			() => {
				SETresponse("No such invite link!")
				SETsaving(false)
			}
		)
	}, [reduxuid, iid, SETresponse])

	useEffect(() => {
		if (props.iid) {
			SETiid(props.iid.slice(1))
			join()
		}
	}, [props.iid, join])

	return (
		<section className="joingroup">
			<h1 className="joingroup__title">Join a group</h1>
			<Input
				value={iid}
				active={!!iid}
				label="Invite link or code"
				className="joingroup__code"
				autoComplete="false"
				onChange={e => {
					SETiid(e.target.value)
					SETresponse("")
				}}
			/>
			{response.value ? (
				<p
					className="joingroup__response"
					style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
			<ButtonSpinner saving={saving} onClick={join} text="Join" />
		</section>
	)
}
