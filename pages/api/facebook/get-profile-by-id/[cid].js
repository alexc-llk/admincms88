import { connectDatabase } from "@/helpers/db-utils";
import { ObjectId } from "mongodb";

export default async function getContentById(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Contents
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");
	const profileHistory = client.db().collection("fb-history")

    const { cid } = req.query
    
	// Retrieve content from Collection
	const profile = await profileCollection.find({ _id: new ObjectId(cid) }).toArray();

	let campaigns = [], adsets = [], ads = []

	// console.log(profile, "profile")

	if(Array.isArray(profile[0].campaign)) {
		campaigns = await Promise.all(profile[0].campaign.map(async cm => {
			const result = await profileHistory.find({ campaign_id: cm.campaign_id }).toArray()
			const campaign_reports = result[0]
			return campaign_reports
		}))
	}
	
	if(Array.isArray(profile[0].adset)) {
		adsets = await Promise.all(profile[0].adset.map(async ad => {
			const result = await profileHistory.find({ adset_id: ad.adset_id }).toArray()
			const adset_reports = result[0]
			return adset_reports
		}))
	} 
	
	if(Array.isArray(profile[0].ad)) {
		ads = await Promise.all(profile[0].ad.map(async ad => {
			const result = await profileHistory.find({ ad_id: ad.ad_id }).toArray()
			const adset_reports = result[0]
			return adset_reports
		}))
	} 
	
	// console.log(adsets, ads, campaigns, "DATA")

	// Close Connection to Database
	client.close();

	// Return Response
	res.json({ success: true, message: "Retrieve Content", data: profile, campaigns, adsets, ads });
	// res.json({ message: "success" })
}
