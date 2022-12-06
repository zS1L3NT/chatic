const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

export default (presence: iPresence) => {
	const now = Date.now()
	const diff = now - presence.lastSeen

	if (presence.isOnline) {
		return "Online"
	} else if (diff < MINUTE) {
		return "Last seen a few seconds ago"
	} else if (diff < HOUR) {
		const minutes = Math.floor(diff / MINUTE)
		return `Last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`
	} else if (diff < DAY) {
		const hours = Math.floor(diff / HOUR)
		return `Last seen ${hours} hour${hours > 1 ? "s" : ""} ago`
	} else if (diff < MONTH) {
		const days = Math.floor(diff / DAY)
		return `Last seen ${days} day${days > 1 ? "s" : ""} ago`
	} else {
		return `Last seen more than a month ago`
	}
}
