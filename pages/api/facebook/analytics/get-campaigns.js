import { connectDatabase } from "@/helpers/db-utils";

export default async function getCampaignsReport(req, res) {
    // 1. Establish Connection to Database
	// 2. Use Collection Profiles
    const client = await connectDatabase()
    const campaignReport = client.db().collection("campaigns")
    const profileCollections = client.db().collection("profiles")

    // console.log(data, "data")

    let active_ids = [], mb_arr = []

    // Retrive campaigns from profileHistory
    const active_profiles = await profileCollections.find({ valid_token: true }).project({ profile_id: 1, _id: 0, media_buyer: 1 }).toArray()

    active_profiles.map(profile => {
        active_ids.push(profile.profile_id)
        if(!mb_arr.includes(profile.media_buyer) && profile.media_buyer) {
            mb_arr.push(profile.media_buyer)
        }
    })

    // // console.log(mb_arr, "arr")

    // // console.log(active_profiles, "active")

    const campaigns = await campaignReport.find({ profile_id: {$in: active_ids} }).toArray();

    campaigns.map((cp, index) => {
        const single = active_profiles.filter(item => item.profile_id === cp.profile_id)
        campaigns[index] = {...campaigns[index], media_buyer: single[0].media_buyer}
    })

    // Close Connection to Database
    client.close();

    res.json({ success: true, message: "Get campaigns", campaigns, mb_arr });
}