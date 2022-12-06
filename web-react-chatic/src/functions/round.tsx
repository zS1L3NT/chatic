export default (number: number, dp: number) => {
	const p = Math.pow(10, dp)
	return Math.round(number * p) / p
}
