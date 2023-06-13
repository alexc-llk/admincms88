import { connectDatabase } from "@/helpers/db-utils";

export default async function getProfile(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

	const data = req.query

	// console.log(data, "query")
	let profiles, all_mb = []

	const all_profiles = await profileCollection.find({}).toArray()

	all_profiles.map(profile => {
		if(!all_mb.includes(profile.media_buyer) && profile.media_buyer) {
			all_mb.push(profile.media_buyer)
		}
	})

	// console.log(data, "mediaBuyer")
	if(data.access_token === "default") {
		if(data.active_mb === "default") {
			profiles = await profileCollection.find({
				profile_id: {$regex: data.search || ""}
			}, { skip: (data.page - 1) * 10, limit: 10 })
			.project({ 
				valid_token: 1, 
				profile_id: 1, 
				created_at: 1, 
				ad_account: 1,
				campaign: 1,
				media_buyer: 1
			}).toArray();
		} else {
			profiles = await profileCollection.find({
				profile_id: {$regex: data.search || ""},
				media_buyer: data.active_mb
			}, { skip: (data.page - 1) * 10, limit: 10 })
			.project({ 
				valid_token: 1, 
				profile_id: 1, 
				created_at: 1, 
				ad_account: 1,
				campaign: 1,
				media_buyer: 1
			}).toArray();
		}
	} else {
		if(data.active_mb === "default") {
			profiles = await profileCollection.find({
				profile_id: {$regex: data.search || ""},
				valid_token: data.access_token === "active" ? true : false 
			}, { skip: (data.page - 1) * 10, limit: 10 })
			.project({ 
				valid_token: 1, 
				profile_id: 1, 
				created_at: 1, 
				ad_account: 1,
				campaign: 1,
				media_buyer: 1
			}).toArray();
		} else {
			profiles = await profileCollection.find({
				profile_id: {$regex: data.search || ""},
				media_buyer: data.active_mb,
				valid_token: data.access_token === "active" ? true : false 
			}, { skip: (data.page - 1) * 10, limit: 10 })
			.project({ 
				valid_token: 1, 
				profile_id: 1, 
				created_at: 1, 
				ad_account: 1,
				campaign: 1,
				media_buyer: 1
			}).toArray();
		}
	}

	// console.log(profiles, "profiles")

	let tableSize, size, inactive

	const latest = await profileCollection.find({}, {sort: {created_at: -1}, limit: 1}).toArray()
	if(data.active_mb !== "default") {
		if(data.access_token === "default") {
			tableSize = await profileCollection.countDocuments({profile_id: {$regex: data.search || ""}, media_buyer: data.active_mb})
		} else {
			tableSize = await profileCollection.countDocuments({profile_id: {$regex: data.search || ""}, media_buyer: data.active_mb, valid_token: data.access_token === "active" ? true : false })
		}
		size = await profileCollection.countDocuments({media_buyer: data.active_mb})
		inactive = await profileCollection.find({ valid_token: false, media_buyer: data.active_mb }).toArray()
	} else {
		if(data.access_token === "default") {
			tableSize = await profileCollection.countDocuments({profile_id: {$regex: data.search || ""}})
		} else {
			tableSize = await profileCollection.countDocuments({profile_id: {$regex: data.search || ""}, valid_token: data.access_token === "active" ? true : false })
		}
		size = await profileCollection.countDocuments()
		inactive = await profileCollection.find({ valid_token: false }).toArray()
	}

	// Close Connection to Database
	client.close();

	// Return Response
	res.json({ success: true, message: "Retrieve Profile", data: profiles, size, inactive, tableSize, latest, media_buyer: all_mb });
}
