import { connectDatabase } from "@/helpers/db-utils";

export default async function CreateCampaign(req, res) {
    try {
        // const startTime = performance.now()
        // 1. Establish Connection to Database
        // 2. Use Collection Voluum Campaign
        const client = await connectDatabase();
        const campaignCollections = client.db().collection("campaigns");
        
        const data = req.body
        const { profile_id } = data

        await campaignCollections.insertOne({ profile_id, reports: [], geo: "", brand: "", description: "" })

        // Close Connection to Database
	    client.close();

        res.json({ profile_id })
    } catch (err) {
        res.json({error: err})
    }
}