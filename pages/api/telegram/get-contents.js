import { connectDatabase } from "@/helpers/db-utils";

export default async function getContent(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Contents
	const client = await connectDatabase();
	const telegramCollections = client.db().collection("telegram");
	const data = req.query

	
	let groupId = []
	if(data.group_id !== "") {
		const arrNum = data.group_id.split(",")
		arrNum.map(num => groupId.push(Number(num)))
		console.log(groupId, "Data")
	} 

	const size = await telegramCollections.countDocuments()
	// const tableSize = await telegramCollections.countDocuments({hostname: {$regex: data.hostname || "" }, path: {$regex: data.path || ""}})

	// Retrieve profiles from Collection
	let contents
	if(groupId.length === 0) {
		contents = await telegramCollections.find({ group_id: { $nin: groupId } }, { skip: (data.page - 1) * 10, limit: 10 }).sort({ _id: -1 }).toArray();
	} else {
		contents = await telegramCollections.find({ group_id: { $in: groupId } }, { skip: (data.page - 1) * 10, limit: 10 }).sort({ _id: -1 }).toArray();
	}
	
    // const contents = await telegramCollections.find({}).toArray()

	// Close Connection to Database
	client.close();

	// Return Response
	res.json({ success: true, message: "Retrieve Telegram Contents", data: contents, size: size });
}
