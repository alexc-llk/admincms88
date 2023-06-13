import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function UpdateCampaigns(req, res) {
    try {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase();
        const profileCollection = client.db().collection("profiles");
        const historyCollection = client.db().collection("fb-history")

        const profiles = await profileCollection.find({}).toArray()

        // Construct Campaigns Data
        await Promise.all(profiles.map(async (ps) => {
            const qs = `access_token=${ps.access_token}`

            const adaccount_response = await fetch(`https://graph.facebook.com/v16.0/me/adaccounts?${qs}&fields=["id", "name", "account_status", "business", "timezone_name"]`)
            const adaccount_result = await adaccount_response.json()
            
            // console.log(adaccount_result.data, "result")

            if(adaccount_result.data) {
                await Promise.all(adaccount_result.data.map(async (adaccount) => {
                    const adset_response = await fetch(`https://graph.facebook.com/v16.0/${adaccount.id}/adsets?${qs}&fields=["name", "campaign_id", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`).catch(error => console.log(error))
                    const all_adsets = await adset_response.json()

                    // console.log(all_adsets.data, "adsets")

                    if(all_adsets.data.length !== 0) {
                        const current_adsets = await profileCollection.findOne({ profile_id: ps.profile_id })
                        let update_adsets = current_adsets.adset || []

                        // Construct Adsets Data
                        const adset_container = all_adsets.data.map((adset) => ({
                            adset_id: adset.id,
                            adset_name: adset.name,
                            adset_status: adset.effective_status,
                            ad_account_id: adaccount.id,
                        }));

                        // Construct history documents for campaigns not already in the database
                        const history_adset = adset_container.map((adset) => ({
                            adset_id: adset.adset_id,
                            name: adset.adset_name,
                            status: adset.adset_status,
                            budget: adset.daily_budget || 0,
                            reports: [],
                            category: "adset",
                            profile_id: ps.profile_id,
                            adaccount: adaccount.id,
                        }));

                        const existingAdsetIds = await historyCollection
                                .find({ adset_id: { $in: adset_container.map((adset) => adset.adset_id) } })
                                .project({ adset_id: 1 })
                                .toArray();
                            
                        // const clean_ad_adsets = ad_adsets.filter(adc => adc !== "empty")

                        const newAdsets = history_adset.filter(
                            (adset) => !existingAdsetIds.find((item) => item.adset_id === adset.adset_id)
                        );

                        if (newAdsets.length > 0) {
                            // Insert new campaigns in bulk
                            await historyCollection.bulkWrite(
                                newAdsets.map((adset) => ({
                                    insertOne: { document: adset },
                                }))
                            );
                        }
                
                        // console.log(adset_container, "ADSET")
                
                        adset_container.map((adset) => {
                            const filter = update_adsets.filter(ads => ads.adset_id === adset.adset_id)
                            if(!filter.length) {
                                update_adsets.push(adset)
                            }
                        })
                
                        // Update mongodb collections
                        await profileCollection.findOneAndUpdate(
                            {profile_id: ps.profile_id}, 
                            {$set: {adset: update_adsets}}
                        );
                    }
                }))
            }
        }))

        // Close Connection to Database
	    client.close();
        res.json({ message: "Update Adsets" })

    } catch (error) {
        res.json({ message: error })
    }

    // console.log(ps._id, clean_ad_campaigns, "CAMPAIGNS")
}