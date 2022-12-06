const { MongoClient } = require("mongodb")
const config = require("config")
const URI = "onlineMongoURI"
const db = config.get(URI)

const dbService = {
	MongoDB: undefined,
	connect: callback => {
		MongoClient.connect(db, { useUnifiedTopology: true }, (err, data) => {
			if (err) {
				callback(err)
			}
			dbService.MongoDB = data.db("nodejs")
			console.log(`MongoDB Connected (${URI})`)
			callback(null)
		})
	}
}

module.exports = dbService
