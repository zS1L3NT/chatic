import React from "react"
import "./Searchbar.scss"

interface props {
	isopen: boolean
	SETisopen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Searchbar(props: props) {
	/**
	 * Function to filter away searchbar results
	 */
	const filter = (event: React.ChangeEvent<HTMLInputElement>) => {
		const search = event.target.value.toLowerCase()

		const cards = document.querySelectorAll(".chatcard")
		for (let i = 0; i < cards.length; i++) {
			const card = cards[i] as HTMLElement
			const usnm = card.querySelector("h3")?.innerHTML.toLowerCase()

			if (!usnm) throw new Error(".usercard has no h3")
			if (usnm.indexOf(search) < 0) {
				if (!card.classList.contains("hide")) {
					card.classList.add("hide")
				}
			} else {
				if (card.classList.contains("hide")) {
					card.classList.remove("hide")
				}
			}
		}
	}

	return (
		<section className={`searchbar ${props.isopen ? "show" : ""}`}>
			<i
				className="searchbar__icon fa fa-times"
				onClick={() => props.SETisopen(false)}
			/>
			<input className="searchbar__input" type="text" onChange={filter} />
		</section>
	)
}
