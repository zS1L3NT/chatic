import { CSSProperties, PropsWithChildren, useEffect, useState } from "react"

const _SkeletonImage = (
	props: PropsWithChildren<{
		src?: string
		skeleton: JSX.Element
		component: (url: string) => JSX.Element
		style?: CSSProperties
	}>
) => {
	const { src, skeleton, component, style } = props

	const [fade, setFade] = useState(false)
	/**
	 * String if loaded successfully,
	 * Null if loaded unsuccessfully,
	 * Undefined if loading in progress
	 */
	const [thumbnailUrl, setThumbnailUrl] = useState<string | null>()

	useEffect(() => {
		let active = true

		setFade(false)

		if (!!src) {
			const image = new Image()
			image.src = src
			image.onload = () => {
				if (active) {
					setFade(true)
					setThumbnailUrl(src)
				}
			}
			image.onerror = () => {
				if (active) {
					setFade(true)
					setThumbnailUrl(null)
				}
			}
		}

		return () => {
			active = false
		}
	}, [src])

	return (
		<div style={{ display: "grid", ...style }}>
			<div style={{ gridArea: "1 / 1 / 2 / 2" }} className={fade ? "fade-out" : ""}>
				{skeleton}
			</div>
			{thumbnailUrl !== undefined && (
				<div style={{ gridArea: "1 / 1 / 2 / 2" }} className="fade-in">
					{component(thumbnailUrl || "")}
				</div>
			)}
		</div>
	)
}

export default _SkeletonImage
