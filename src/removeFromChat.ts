import { Request, Response } from "express"
import admin from "firebase-admin"
import Repo from "./Repository"

export default (Repo: Repo, storage: admin.storage.Storage) => async (
	req: Request,
	res: Response
) => {
	const { cid, uid } = req.body as { cid: string; uid: string }
	const promises: Promise<any>[] = []
	console.time(`removed (${uid}) from (${cid})`)

	Repo.chat(cid).get(
		chat => {
			if (chat.users.length === 1) {
				for (let i = 0, il = chat.media.length; i < il; i++) {
					const mediaid = chat.media[i]
					promises.push(
						storage.bucket().file(`${cid}/${mediaid}.png`).delete()
					)
				}
				promises.push(storage.bucket().file(`${cid}/icon.png`).delete())
				promises.push(Repo.chat(cid).remove())
				promises.push(
					new Promise(res => {
						Repo.invites()
							.where("cid", "==", cid)
							.get(invites => {
								const promises: Promise<any>[] = []
								const iids = Object.keys(invites)

								for (let i = 0, il = iids.length; i < il; i++) {
									const iid = iids[i]
									promises.push(Repo.invite(iid).remove())
								}

								Promise.all(promises).then(() => res(null))
							})
					})
				)
			} else {
				promises.push(
					Repo.chat(cid).update({
						users: admin.firestore.FieldValue.arrayRemove(uid),
						admins: admin.firestore.FieldValue.arrayRemove(uid)
					})
				)
			}

			promises.push(
				Repo.user(uid).update({
					chatorder: admin.firestore.FieldValue.arrayRemove(cid),
					["unread." + cid]: admin.firestore.FieldValue.delete()
				})
			)

			Promise.all(promises).then(() => {
				console.timeEnd(`removed (${uid}) from (${cid})`)
				res.end()
			})
		},
		() => {
			console.timeEnd(`removed (${uid}) from (${cid})`)
			res.send(`No chat with cid "${cid}" found`)
		}
	)
}
