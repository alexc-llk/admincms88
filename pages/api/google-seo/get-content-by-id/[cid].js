import { connectDatabase } from "@/helpers/db-utils";
import { ObjectId } from "mongodb";

export default async function getContentById(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Contents
	const client = await connectDatabase();
	const contentsCollection = client.db().collection("contents");

    const { cid } = req.query

	// Retrieve content from Collection
	const contents = await contentsCollection.find({ _id: new ObjectId(cid) }).toArray();

	// Close Connection to Database
	client.close();

	// Return Response
	res.json({ success: true, message: "Retrieve Content", data: contents });
}
