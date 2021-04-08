import React, { useEffect } from "react"
import "./ContextMenu.scss"

interface props {
	ctm: React.MouseEvent
	SETctm: React.Dispatch<React.SetStateAction<React.MouseEvent | undefined>>
	options: {
		title: string
		icon: string
		access: boolean
		onClick: () => void
	}[]
}

export default function ContextMenu(props: props) {
	const { ctm, SETctm, options } = props

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (
				!document
					.querySelector(".contextmenu")
					?.contains(e.target as Node)
			)
				SETctm(undefined)
		}

		window.addEventListener("click", onClick)
		window.addEventListener("contextmenu", onClick)
		return () => {
			window.removeEventListener("click", onClick)
			window.removeEventListener("contextmenu", onClick)
		}
	}, [SETctm])

	return options.map(o => o.access).includes(true) ? (
		<section
			className={"contextmenu " + (ctm ? "active " : "")}
			style={{ top: mouseY(ctm), left: mouseX(ctm) }}>
			{options.map(option =>
				option.access ? (
					<button
						key={option.title}
						className="contextmenu__button"
						type="button"
						onClick={option.onClick}>
						<i
							className={`fa fa-${option.icon} contextmenu__button__icon`}
						/>
						{option.title}
					</button>
				) : (
					null
				)
			)}
		</section>
	) : null
}

function mouseX(evt: React.MouseEvent) {
	if (evt.pageX) {
		return evt.pageX
	} else if (evt.clientX) {
		return (
			evt.clientX +
			(document.documentElement.scrollLeft
				? document.documentElement.scrollLeft
				: document.body.scrollLeft)
		)
	}
	return 0
}

function mouseY(evt: React.MouseEvent) {
	if (evt.pageY) {
		return evt.pageY
	} else if (evt.clientY) {
		return (
			evt.clientY +
			(document.documentElement.scrollTop
				? document.documentElement.scrollTop
				: document.body.scrollTop)
		)
	}
	return 0
}
