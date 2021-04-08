import { Request, Response } from "express"
import { firestore } from "firebase-admin"
import Repo from "./Repository"

export default (Repo: Repo) => (req: Request, res: Response) => {
	const { cid, uid } = req.body as { cid: string; uid: string }
	const promises: Promise<any>[] = []
	console.time(`added (${uid}) to (${cid})`)

	promises.push(
		Repo.chat(cid).update({
			users: firestore.FieldValue.arrayUnion(uid)
		})
	)

	promises.push(
		Repo.user(uid).update({
			chatorder: firestore.FieldValue.arrayUnion(cid)
		})
	)

	Promise.all(promises).then(() => {
		console.timeEnd(`added (${uid}) to (${cid})`)
		res.end()
	})
}
