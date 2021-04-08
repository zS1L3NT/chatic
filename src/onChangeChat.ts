import { Request, Response } from "express"
import { firestore } from "firebase-admin"
import Repo from "./Repository"

export default (Repo: Repo) => async (req: Request, res: Response) => {
	const { uid, cid, ipv4 } = req.body as {
		uid: string
		cid: string
		ipv4: string
	}
	const logID = Math.random()
	const promises: Promise<any>[] = []
	console.time(`change chat callback (${uid}, ${cid}) ${logID}`)

	promises.push(Repo.user(uid).presenceIP(ipv4).update({ listening: cid }))

	promises.push(
		new Promise(res =>
			cid
				? Repo.chat(cid)
						.messages()
						.where(new firestore.FieldPath("status", uid), ">", 0)
						.where(new firestore.FieldPath("status", uid), "<", 3)
						.get(messages => {
							const promises: Promise<any>[] = []
							const mids = Object.keys(messages)

							for (let i = 0, il = mids.length; i < il; i++) {
								const mid = mids[i]
								promises.push(
									Repo.chat(cid)
										.message(mid)
										.update({
											status: { [uid]: 3 }
										})
								)
							}

							Promise.all(promises).then(() => res(null))
						})
				: res(null)
		)
	)

	Promise.all(promises).then(() => {
		console.timeEnd(`change chat callback (${uid}, ${cid}) ${logID}`)
		res.end()
	})
}
