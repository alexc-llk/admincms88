import { connectDatabase } from "@/helpers/db-utils";

export default async function getProfile(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

    try {
        const data = req.body;

		// console.log(Boolean(data.access_token !== "" && data.access_token))

		if(data.access_token !== "" && data.access_token) {
			// Check token validity
			const response = await fetch(`https://graph.facebook.com/v16.0/me?access_token=${data.access_token}`)

			// console.log(response, "res")

			if (response.status === 200) {
				await profileCollection.findOneAndUpdate({profile_id: data.profile_id}, {$set: {valid_token: true, access_token: data.access_token }});
			} else {
				await profileCollection.findOneAndUpdate({profile_id: data.profile_id}, {$set: {valid_token: false, access_token: data.access_token }});
			}
		}

		if(data.media_buyer !== "") {
			await profileCollection.findOneAndUpdate({profile_id: data.profile_id}, {$set: {media_buyer: data.media_buyer }});
		}

		// Close Connection to Database
		client.close();

		res.status(201).json({ success: true, result, message: "Profile updated successfully" });
    } catch (err) {
        res.json({ success: false, message: "Fail to create profile" })
    }
}
