import { Request, Response } from "express"
import { firestore } from "firebase-admin"
import Repo from "./Repository"

export default (Repo: Repo) => (req: Request, res: Response) => {
	const { cid, uid } = req.body as { cid: string; uid: string }
	const promises: Promise<any>[] = []
	console.time(`deleted (${uid}) chat (${cid})`)

	promises.push(
		new Promise(res => {
			Repo.chat(cid)
				.messages()
				.where(new firestore.FieldPath("status", uid), ">", 0)
				.get(messages => {
					const promises: Promise<any>[] = []

					for (const mid in messages) {
						promises.push(
							new Promise(res => {
								Repo.chat(cid)
									.message(mid)
									.get(async status => {
										const keys = Object.keys(status)
										if (
											keys.length === 1 &&
											keys[0] === uid
										) {
											await Repo.chat(cid)
												.message(mid)
												.remove()
										} else {
											await Repo.chat(cid)
												.message(mid)
												.update({
													["status." +
													uid]: firestore.FieldValue.delete()
												})
										}

										res(null)
									})
							})
						)
					}

					Promise.all(promises).then(() => res(null))
				})
		})
	)

	promises.push(
		new Promise(res => {
			Repo.chat(cid).get(async chat => {
				if (chat.type === "direct") {
					await Repo.user(uid).update({
						chatorder: firestore.FieldValue.arrayRemove(cid)
					})
				}
				res(null)
			})
		})
	)

	Promise.all(promises).then(() => {
		console.timeEnd(`deleted (${uid}) chat (${cid})`)
		res.end()
	})
}
