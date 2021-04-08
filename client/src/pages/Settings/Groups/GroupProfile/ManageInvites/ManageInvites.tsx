import React, { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import InviteCard from "./InviteCard/InviteCard"
import DatePicker from "react-datepicker"
import { IInvite } from "../../../../../Types"
import Repo from "../../../../../Repository"
import "./ManageInvites.scss"
import { useFadeState } from "../../../../../hooks/useFadeState"
import Functions from "../../../../../Functions"

interface props {
	cid: string
	access: boolean
}

export default function ManageInvites(props: props) {
	const { cid, access } = props

	const [uses, SETuses] = useState(1)
	const [date, SETdate] = useState<Date | null>(new Date())
	const [response, SETresponse] = useFadeState()
	const [invites, SETinvites] = useState<{ [iid: string]: IInvite }>({})

	useEffect(() => {
		return Repo.invites().observe(SETinvites)
	}, [cid])

	const add = async () => {
		if (!uses) return SETresponse("Can't add an invite link with no uses!")
		if (!date) return SETresponse("No date selected!")
		if (date.getTime() < new Date().getTime()) return SETresponse("Date selected is in the past!")

		SETresponse("")
		SETdate(new Date())
		SETuses(1)

		let result = ""
		while (true) {
			try {
				result = genID()
				await Functions.findInvite(result)
				continue
			} catch {
				break
			}
		}

		Repo.invite(result).set({
			expires: date.getTime(),
			uses,
			cid
		})
	}

	const genID = () => {
		let result = ""
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		for (let i = 0; i < 8; i++) {
			result += characters.charAt(Math.floor(Math.random() * 62))
		}
		return result
	}

	return (
		<>
			<hr />
			<h1 className="manage">Manage Invites</h1>
			<div className="manage__invites">
				<div className="manage__invites__properties">
					<p>Invite code</p>
					<p>Uses left</p>
					<p>Expiry date</p>
					<p></p>
				</div>
				<div className="manage__invites__create">
					<Skeleton />
					<input
						value={uses}
						type="number"
						disabled={!access}
						className={!access ? "disabled" : ""}
						onChange={e => {
							const i = e.target.valueAsNumber
							if (i >= 0) SETuses(i)
						}}
					/>
					<DatePicker
						selected={date}
						disabled={!access}
						className={!access ? "disabled" : ""}
						onChange={date => SETdate(date as Date | null)}
					/>
					<button className={!access ? "disabled" : ""} type="button" disabled={!access} onClick={add}>
						+
					</button>
				</div>
				{Object.keys(invites).map(iid => (
					<InviteCard key={iid} access={access} cid={cid} iid={iid} />
				))}
			</div>
			{response.value ? (
				<p className="manage__invites__response" style={{ animation: response.animation }}>
					{response.value}
				</p>
			) : (
				<></>
			)}
		</>
	)
}
