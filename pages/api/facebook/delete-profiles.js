import { connectDatabase } from "@/helpers/db-utils";

export default async function deleteProfile(req, res) {

	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");
    const campaignsCollection = client.db().collection("campaigns")
    const fbHistory = client.db().collection("fb-history")
    
    const { id, ids } = req.body;

    try {
        if(Array.isArray(ids)) {
            await profileCollection.deleteMany({ profile_id: { $in: ids } }); 
            await campaignsCollection.deleteMany({ profile_id: { $in: ids } }); 
            await fbHistory.deleteMany({ profile_id: { $in: ids } }); 
        } else {
            await profileCollection.deleteOne({ profile_id: id }); 
            await campaignsCollection.deleteOne({ profile_id: id }); 
            await fbHistory.deleteOne({ profile_id: id }); 
        }

        // Retrieve profiles from Collection
        const profiles = await profileCollection.find({}, { sort: {created_at: -1}, limit: 10 })
		.project({ 
			valid_token: 1, 
			profile_id: 1, 
			created_at: 1, 
			ad_account: 1,
			campaign: 1
		}).toArray();
        const size = await profileCollection.countDocuments()

        // Close Connection to Database
	    client.close();
        
        res.status(201).json({ success: true, data: profiles, size: size, tableSize: size, message: "Profiles has been removed" });
    } catch (err) {
        res.json({ success: false, message: "Fail to delete profiles" })
    }
}
