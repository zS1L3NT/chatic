import { Request, Response } from "express"
import Repo from "./Repository"

export default (Repo: Repo) => (req: Request, res: Response) => {
	const { iid } = req.body as { iid: string }
	console.time(`finding invite code (${iid})`)

	Repo.invite(iid).get(
		invite => {
			res.status(200).send(invite)
			console.timeEnd(`finding invite code (${iid})`)
		},
		() => {
			res.status(500).send({})
			console.timeEnd(`finding invite code (${iid})`)
		}
	)
}
