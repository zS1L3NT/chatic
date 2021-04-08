import { Request, Response } from "express"
import { firestore } from "firebase-admin"
import Repo from "./Repository"

export default (Repo: Repo) => (req: Request, res: Response) => {
	const { uids, cid, mid, message } = req.body as {
		uids: string[]
		cid: string
		mid: string
		message: string
	}
	const uid = message.match(/^<!@(.*)>/)![1]
	const promises: Promise<any>[] = []
	console.time(`message callback (${uid}, ${cid}, ${mid}, ${message})`)

	const status: { [uid: string]: 1 | 2 | 3 } = {
		[uid]: 3
	}

	promises.push(Repo.chat(cid).update({ lastmsg: message }))

	promises.push(
		new Promise(async res => {
			Repo.user(uid).get(
				async ({ chatorder }) => {
					if (chatorder.includes(cid)) {
						await Repo.user(uid).update({
							chatorder: [
								cid,
								...chatorder.filter(i => i !== cid)
							]
						})
					} else {
						await Repo.user(uid).update({
							chatorder: [cid, ...chatorder]
						})
					}

					res(null)
				},
				async () => {
					await Repo.user(uid).update({
						chatorder: [cid]
					})

					res(null)
				}
			)
		})
	)

	for (let i = 0, il = uids.length; i < il; i++) {
		const uid = uids[i]

		/**
		 * * Set other user's chat order
		 * * Set other user's unread messages
		 */
		promises.push(
			new Promise(async res => {
				Repo.user(uid).get(
					async ({ chatorder }) => {
						if (chatorder.includes(cid)) {
							await Repo.user(uid).update({
								chatorder: [
									cid,
									...chatorder.filter(i => i !== cid)
								],
								unread: {
									[cid]: firestore.FieldValue.increment(1)
								}
							})
						} else {
							await Repo.user(uid).update({
								chatorder: [cid, ...chatorder],
								unread: {
									[cid]: firestore.FieldValue.increment(1)
								}
							})
						}

						res(null)
					},
					async () => {
						await Repo.user(uid).update({
							chatorder: [cid],
							unread: {
								[cid]: firestore.FieldValue.increment(1)
							}
						})

						res(null)
					}
				)
			})
		)

		/**
		 * * Set other user's message status
		 */
		promises.push(
			new Promise(async res => {
				Repo.user(uid)
					.presence()
					.get(presence => {
						if (
							Object.values(presence)
								.map((ipd: any) => ipd.listening)
								.includes(cid)
						) {
							status[uid] = 3
						} else if (
							Object.values(presence)
								.map((ipd: any) => ipd.isOnline)
								.includes(true)
						) {
							status[uid] = 2
						} else {
							status[uid] = 1
						}
					})

				res(null)
			})
		)
	}

	Promise.all(promises).then(async () => {
		await Repo.chat(cid).message(mid).update({
			status
		})
		res.end()
		console.timeEnd(`message callback (${uid}, ${cid}, ${mid}, ${message})`)
	})
}
