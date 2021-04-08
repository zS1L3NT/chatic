import { useEffect } from "react"
import { FadeRedirect } from "../../App"
import "./PageNotFound.scss"

export default function PageNotFound() {
	useEffect(FadeRedirect, [])

	return (
		<article id="pagenotfound-page">
			<h1>Error code 404: Page Not Found</h1>
		</article>
	)
}
