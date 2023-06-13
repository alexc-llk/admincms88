import { connectDatabase } from "@/helpers/db-utils";

export default async function getProfile(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

    const data = req.query

	// Retrieve profiles from Collection
    // console.log(data.search)
	const profiles = await profileCollection.find({ profile_id: {$regex: data.search} }).toArray();
    // console.log(profiles)
	// Close Connection to Database
	client.close();

	// Return Response
	res.json({ success: true, message: "Retrieve Profile", data: profiles });
}
