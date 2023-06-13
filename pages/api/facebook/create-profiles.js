import { connectDatabase } from "@/helpers/db-utils";

export default async function createProfile(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

    try {
        const data = req.body;

		await profileCollection.createIndex({ profile_id: 1 }, { unique: true })
		await profileCollection.insertMany(data, { timestamp: true });

		await Promise.all(data.map(async (profile) => {
			await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/voluum/create-campaign`, {
				method: "POST",
				body: JSON.stringify({
					profile_id: profile.profile_id
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				}
			})

			await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/update-bm`, {
				method: "POST",
				body: JSON.stringify({
					profile_id: profile.profile_id
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				}
			})
		}))

		await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/controller/facebook/update-today`)

		// Retrieve profiles from Collection
		// const profiles = await profileCollection.find({}).sort({ _id: -1 }).toArray();
		// const size = await profileCollection.countDocuments()
		// const tableSize = await profileCollection.countDocuments({hostname: {$regex: data.hostname || "" }, path: {$regex: data.path || ""}})

		// Close Connection to Database
	    client.close();

		// res.status(200).json({ success: true, data: profiles, size: size, tableSize: size, message: "Post created successfully" });
		res.status(200).json({ message: "Post created successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Fail to create profile" })
    }
}
