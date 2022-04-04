import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const Index = () => {
	const [numbers, setNumbers] = useState(
		Array(10)
			.fill(0)
			.map((_, i) => i)
	)

	useEffect(() => {
		const interval = setInterval(() => {
			setNumbers(
				Array(10)
					.fill(0)
					.map((_, i) => i)
					.sort(() => Math.random() - 0.5)
			)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div>
			{numbers.map(number => (
				<motion.li key={number} value={number} draggable={false} layout>
					{number}
				</motion.li>
			))}
		</div>
	)
}

export default Index
