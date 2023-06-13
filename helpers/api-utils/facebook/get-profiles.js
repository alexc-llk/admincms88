import { connectDatabase } from "../../db-utils";

export async function getProfiles(page) {
	// 1. Database Connection
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

	const profiles = await profileCollection.find({}, { sort: {created_at: -1}, skip: (page - 1) * 10, limit: 10 }).toArray();
	const latest = await profileCollection.find({}, {sort: {created_at: -1}, limit: 1}).toArray()
	const size = await profileCollection.countDocuments()
	const inactive = await profileCollection.find({ valid_token: false }).toArray()

	client.close();

	return {
		success: true,
		message: "Retrieve Profiles",
		data: profiles,
		size: size,
		latest: latest,
		inactive: inactive
	};
}
