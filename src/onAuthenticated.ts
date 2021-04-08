import { Request, Response } from "express"
import { firestore } from "firebase-admin"
import Repo from "./Repository"

export default (Repo: Repo) => (req: Request, res: Response) => {
	const { uid } = req.body as { uid: string }
	const promises: Promise<any>[] = []
	console.time(`authenticate callback (${uid})`)

	promises.push(
		new Promise(res => {
			Repo.user(uid).get(user => {
				const promises: Promise<any>[] = []
				const cids = user.chatorder

				for (let i = 0, il = cids.length; i < il; i++) {
					const cid = cids[i]

					promises.push(
						new Promise(res => {
							Repo.chat(cid)
								.messages()
								.where(
									new firestore.FieldPath("status", uid),
									"==",
									1
								)
								.get(messages => {
									const promises: Promise<any>[] = []
									const mids = Object.keys(messages)

									for (
										let i = 0, il = mids.length;
										i < il;
										i++
									) {
										const mid = mids[i]
										promises.push(
											Repo.chat(cid)
												.message(mid)
												.update({
													status: { [uid]: 2 }
												})
										)
									}

									Promise.all(promises).then(() => res(null))
								})
						})
					)
				}

				Promise.all(promises).then(() => res(null))
			})
		})
	)

	Promise.all(promises).then(() => {
		console.timeEnd(`authenticate callback (${uid})`)
		res.end()
	})
}
