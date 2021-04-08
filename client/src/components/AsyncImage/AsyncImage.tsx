import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

interface props {
	src?: string
	className: string
}

export default function AsyncImage(props: props) {
	const { src, className } = props
	const [loaded, SETloaded] = useState<string | null>(null)

	useEffect(() => {
		SETloaded(null)
		if (src) {
			const handleLoad = () => {
				SETloaded(src)
			}
			const image = new Image()
			image.addEventListener("load", handleLoad)
			image.src = src
			return () => {
				image.removeEventListener("load", handleLoad)
			}
		}
	}, [src])

	if (loaded === src) {
		return <img src={src} className={className} alt="" />
	} else {
		return <Skeleton className={className + "__skeleton"} />
	}
}
