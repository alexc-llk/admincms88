import { connectDatabase } from "@/helpers/db-utils";

export default async function getContent(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Contents
	const client = await connectDatabase();
	const profileCollection = client.db().collection("contents");
	const data = req.query

	const size = await profileCollection.countDocuments()
	const tableSize = await profileCollection.countDocuments({hostname: {$regex: data.hostname || "" }, path: {$regex: data.path || ""}})

	// Retrieve profiles from Collection
	const contents = await profileCollection.find({hostname: {$regex: data.hostname || "" }, path: {$regex: data.path || ""}}, { skip: (data.page - 1) * 10, limit: 10 }).sort({ _id: -1 }).toArray();

	// Close Connection to Database
	client.close();

	// Return Response
	res.json({ success: true, message: "Retrieve Profile", data: contents, size: size, tableSize: tableSize });
}
