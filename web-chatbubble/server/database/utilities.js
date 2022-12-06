const { ObjectId } = require("mongodb")

module.exports = MongoDB => {
	const Users = MongoDB.collection("users")
	const Groups = MongoDB.collection("groups")
	const AllCollections = MongoDB.listCollections().toArray()
	const Coll = name => MongoDB.collection(name)
	const getTable = async (cType, cData, oType = "", oData = "") => {
		const group = cData.slice(1, -1)
		try {
			if (cType === "group") {
				let tables = await AllCollections
				for (const table of tables) {
					if (table.name.includes(`["${group}","`)) {
						return table.name
					}
				}
			} else {
				if (cType === "_id") {
					var { usnm: cUsnm } = await Users.findOne({
						_id: ObjectId(cData)
					})
				} else if (cType === "usnm") var cUsnm = cData
				else return null

				if (oType === "_id") {
					var { usnm: oUsnm } = await Users.findOne({
						_id: ObjectId(oData)
					})
				} else if (oType === "usnm") var oUsnm = oData
				else return null

				const queryTables = [
					`["default","${cUsnm}","${oUsnm}"]`,
					`["default","${oUsnm}","${cUsnm}"]`
				]

				var query = await AllCollections
				var table
				for (item of query) {
					if (item.name == queryTables[0]) {
						table = queryTables[0]
					} else if (item.name == queryTables[1]) {
						table = queryTables[1]
					}
				}

				return table
			}
		} catch (err) {
			console.log("%%% ERROR:".bgRed, err)
		}
	}
	const NewColl = name => MongoDB.createCollection(name)

	return { Users, Groups, AllCollections, Coll, getTable, NewColl }
}
