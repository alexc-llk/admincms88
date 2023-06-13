import { connectDatabase } from "@/helpers/db-utils";

export default async function createContent(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Contents
	const client = await connectDatabase();
	const contentsCollection = client.db().collection("contents");

    try {
        const data = req.body;

		// await contentsCollection.createIndex({ domain: 1 }, { unique: true }) --- eg: set unique
		await contentsCollection.insertMany(data, { timestamp: true });

		// Retrieve profiles from Collection
		const contents = await contentsCollection.find({}).sort({ _id: -1 }).toArray();
		const size = await contentsCollection.countDocuments()
		const tableSize = await contentsCollection.countDocuments({hostname: {$regex: data.hostname || "" }, path: {$regex: data.path || ""}})

		// Close Connection to Database
		client.close();
		
		res.status(201).json({ success: true, data: contents, size: size, tableSize: tableSize, message: "Post created successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Fail to create site" })
    }
}
