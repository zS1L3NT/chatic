var online = ["ChatBot"]

module.exports.all = online

module.exports.set = name => {
	online.push(name)
}

module.exports.clear = _ => {
	online.length = 0
	online.push("ChatBot")
}
