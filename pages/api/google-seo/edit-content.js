import { connectDatabase } from "@/helpers/db-utils";
import { ObjectId } from "mongodb";

export default async function editContent (req, res) {
    // 1. Establish Connection to Database
	// 2. Use Collection Contents
    const client = await connectDatabase()
    const contentsCollection = client.db().collection("contents")

    try {
        // Data Preps
        let data = req.body
        const id = data._id
        delete data._id

        // Update content to Collection
        await contentsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data })

        // Retrieve content from Collection
	    const contents = await contentsCollection.find({ _id: new ObjectId(id) }).toArray();

        // Close Connection to Database
        client.close()

        res.json({ success: true, message: "Update Content", data: contents })
    } catch (error) {
        console.log(error)
    }
}