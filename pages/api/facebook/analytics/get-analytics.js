import { connectDatabase } from "@/helpers/db-utils";

export default async function getCampaignsReport(req, res) {
    // 1. Establish Connection to Database
	// 2. Use Collection Profiles
    const client = await connectDatabase()
    const analyticsCollections = client.db().collection("facebook-summary")

    // Retrive campaigns from profileHistory
    const analytics = await analyticsCollections.find({}).toArray();

    // Close Connection to Database
    client.close();

    res.json({ success: true, message: "Get campaigns", analytics });
}