import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "./Avatar.scss"

interface props {
	src: string
	isOnline: boolean | null
}

export default function Avatar(props: props) {
	const { src, isOnline } = props

	const [image, SETimage] = useState("")

	/**
	 * & Loads image asynchronously
	 */
	useEffect(() => {
		let MOUNTED = true

		SETimage("")
		if (src) {
			loader(src).then(image => {
				if (MOUNTED) SETimage(image)
			})
		}

		return () => {
			MOUNTED = false
		}
	}, [src])

	/**
	 * ~ Loads image while the skeleton is in it's place
	 * @param url URL of the image to be loaded
	 */
	const loader = (url: string) => {
		return new Promise<string>(res => {
			var image = new Image()
			image.src = url
			image.onload = () => res(url)
			image.onerror = () =>
				res(
					"https://firebasestorage.googleapis.com/v0/b/chatic-29274.appspot.com/o/profiles%2FGuest.png?alt=media"
				)
		})
	}

	return image ? (
		<section className="avatar">
			<div className="avatar__container">
				<img className="avatar__container__img" src={src} alt="#" />
			</div>
			{isOnline !== null && (
				<span
					className={`avatar__isOnline ${
						isOnline ? "active" : ""
					}`}></span>
			)}
		</section>
	) : (
		<Skeleton className="avatar__skeleton" />
	)
}
