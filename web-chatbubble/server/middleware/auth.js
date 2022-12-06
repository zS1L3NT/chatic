const jwt = require("jsonwebtoken")
const config = require("config")

// The next is referring to the next item in requesting item's params
auth = (req, res, next) => {
	const token = req.header("x-auth-token")

	// Check for token
	if (!token) return res.status(401).send("No token, authorization denied")

	try {
		// Verify token with jwt.verify() and add user from payload
		req.user = jwt.verify(token, config.get("jwtSecret"))
		// Go to next param value
		next()
	} catch (e) {
		res.status(400).send("Token is not valid")
	}
}

module.exports = auth
