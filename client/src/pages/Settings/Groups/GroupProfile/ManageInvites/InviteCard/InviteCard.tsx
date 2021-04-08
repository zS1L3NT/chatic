import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import Repo from "../../../../../../Repository"
import { IInvite } from "../../../../../../Types"
import ConfirmMenu from "../../../../../../components/ConfirmMenu/ConfirmMenu"
import "./InviteCard.scss"

interface props {
	access: boolean
	cid: string
	iid: string
}

export default function InviteCard(props: props) {
	const { access, cid, iid } = props
	const [invite, SETinvite] = useState<IInvite>()
	const [date, SETdate] = useState("")

	const [cfm, SETcfm] = useState(false)

	useEffect(() => {
		return Repo.invite(iid).observe(
			invite => {
				if (invite.expires < new Date().getTime() || !invite.uses) {
					Repo.invite(iid).remove()
					return
				}
				SETinvite(invite)
			},
			() => {
				console.error(`[InviteCard.tsx] IID "${iid}" is a key but has no value???`)
			}
		)
	}, [cid, iid])

	useEffect(() => {
		if (invite) {
			const date = new Date(invite.expires)
			const hours = date.getHours()
			const minutes = date.getMinutes()
			let str = ""

			str += hours >= 10 ? hours : "0" + hours
			str += ":"
			str += minutes >= 10 ? minutes : "0" + minutes
			str += hours < 13 ? "am" : "pm"
			str += " "

			str += date.toLocaleDateString()

			SETdate(str)
		}
	}, [invite])

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(`http://chatic.zectan.com/chat/joingroup/${iid}`)
			.then(() => alert("Copied link to clipboard!"))
			.catch(() => alert("Couldn't copy link to clipboard"))
	}

	return (
		<section className="invitecard">
			<h3 className="invitecard__iid" onClick={copyToClipboard}>
				{iid}
			</h3>
			<p className="invitecard__uses">{invite?.uses || <Skeleton width={30} />}</p>
			<p className="invitecard__expires">{invite ? date : <Skeleton width={160} />}</p>
			<button
				className={"invitecard__delete" + (!access ? " disabled" : "")}
				disabled={!access}
				type="button"
				onClick={() => SETcfm(true)}>
				&times;
			</button>
			{cfm && (
				<ConfirmMenu
					SETcfm={SETcfm}
					action="delete this invite"
					trueMsg="Yes, delete it"
					falseMsg="Wait, no"
					onRes={res => res && Repo.invite(iid).remove()}
				/>
			)}
		</section>
	)
}
