import { useState } from "react"
import "./Input.scss"

interface props {
	label: string
	type?: string
	style?: {
		[property: string]: string
	}
	placeholder?: string
	required?: boolean
	autoComplete?: string
	className?: string
	value?: string
	active?: boolean
	disabled?: boolean
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function Input(props: props) {
	const {
		label,
		type,
		style,
		placeholder,
		required,
		autoComplete,
		className,
		value,
		active,
		disabled,
		onChange,
		onKeyUp,
		onKeyDown
	} = props
	const [hastext, SEThastext] = useState(false)
	const [visible, SETvisible] = useState(false)

	/**
	 * Function running whenever the text input changes
	 * @param e Event
	 */
	const onChangeFunction = (e: any) => {
		if (onChange) onChange(e)
		if (e.target.value !== "") SEThastext(true)
		else SEThastext(false)
	}

	/**
	 * Toggles visibility of the password if component is typeof 'password'
	 */
	const ChangeVisibility = () => {
		SETvisible(!visible)
	}

	return (
		<section className={"input " + (className || "")}>
			<div className="input__wrapper">
				<input
					className={
						"input__wrapper__input " + ((hastext || active) ? "active" : "")
					}
					name={label}
					type={visible ? "text" : type || "text"}
					placeholder={placeholder}
					style={style}
					autoComplete={autoComplete}
					value={value}
					onChange={onChangeFunction}
					onKeyUp={onKeyUp}
					onKeyDown={onKeyDown}
					required={required || false}
					disabled={disabled || false}
				/>
				{type === "password" && (
					<i
						className={
							"input__wrapper__input__eye fas fa-eye" +
							(visible ? "-slash" : "")
						}
						onClick={ChangeVisibility}></i>
				)}
				<div className="input__wrapper__underline"></div>
				<label className="input__wrapper__label">{label}</label>
			</div>
		</section>
	)
}
