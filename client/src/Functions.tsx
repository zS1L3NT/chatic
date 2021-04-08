import axios from "axios"

class Functions {
	private page(url: string) {
		return (localStorage.getItem("url") || "") + "/functions/" + url
	}

	onMessage(uids: string[], cid: string, mid: string, message: string) {
		return axios.post(this.page("onMessage"), { uids, cid, mid, message })
	}

	getChatList(uid: string, page: number) {
		return axios.post(this.page("getChatList"), { uid, page })
	}

	addToChat(uid: string, cid: string) {
		return axios.post(this.page("addToChat"), { uid, cid })
	}

	onChangeChat(uid: string, cid: string, ipv4: string) {
		if (!uid) return
		return axios.post(this.page("onChangeChat"), { uid, cid, ipv4 })
	}

	onAuthenticated(uid: string) {
		return axios.post(this.page("onAuthenticated"), { uid })
	}

	removeFromChat(uid: string, cid: string) {
		return axios.post(this.page("removeFromChat"), { uid, cid })
	}

	findInvite(iid: string) {
		return axios.post(this.page("findInvite"), { iid })
	}

	clearChat(uid: string, cid: string) {
		return axios.post(this.page("clearChat"), { uid, cid })
	}
}

export default new Functions()