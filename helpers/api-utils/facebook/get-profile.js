import { connectDatabase } from "../../db-utils";

export async function getProfile(id) {
	// 1. Database Connection
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

	const profile = profileCollection.findOne(id);

	client.close();

	return {
		success: true,
		message: "Retrieve Profiles",
		data: profile,
	};
}
