import { connectDatabase } from "@/helpers/db-utils";
import { ObjectId } from "mongodb";

export default async function deleteContent (req, res) {
    // 1. Establish Connection to Database
	// 2. Use Collection Contents
    const client = await connectDatabase()
    const contentsCollection = client.db().collection("contents")

    try {
        const { id, ids } = req.body
        let objIds = []

        if(Array.isArray(ids)) {
            ids.map((id => objIds.push(new ObjectId(id))))
        } else {
            objIds.push(new ObjectId(id))
        }
        
        const result = await contentsCollection.deleteMany({ _id: { $in: objIds } })

        // Retrieve content from Collection
	    const contents = await contentsCollection.find({}, { skip: 0, limit: 10 }).sort({ _id: -1 }).toArray();

        const size = await contentsCollection.countDocuments()

        // Close Connection to Database
	    client.close();

        if(result.deletedCount !== 0) {
            res.status(201).json({ success: true, message: "Domain has been removed", data: contents, size: size, tableSize: size })
        } else {
            res.json({ success: false, message: "Content not found" })
        }
    } catch (error) {
        console.log(error)
    }
}   