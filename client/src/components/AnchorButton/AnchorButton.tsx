import "./AnchorButton.scss"

interface props {
	onClick: (event: any) => void
	style?: {
		[property: string]: string
	}
	children: any
	className?: string
}

export default function Anchor_Button(props: props) {
	const { onClick, style, children, className } = props

	return (
		<button
			className={"anchor_button " + className}
			style={style}
			type="button"
			onClick={onClick}>
			{children}
		</button>
	)
}
