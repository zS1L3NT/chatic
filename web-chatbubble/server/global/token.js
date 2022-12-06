var token = {}

module.exports.all = token

module.exports.set = (eml, key, item) => {
	token[eml] = { key, item }
}

module.exports.clear = eml => {
	delete token[eml]
}
