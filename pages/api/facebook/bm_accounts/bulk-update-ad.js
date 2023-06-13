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
                    const ad_response = await fetch(`https://graph.facebook.com/v16.0/${adaccount.id}/ads?${qs}&fields=["name", "adset_id", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`).catch(error => console.log(error))
                    const adset_response = await fetch(`https://graph.facebook.com/v16.0/${adaccount.id}/adsets?${qs}&fields=["name", "adset_id", "daily_budget"]&date_preset=today`).catch(error => console.log(error))
                    const all_ads = await ad_response.json()
                    const all_adsets = await adset_response.json()

                    // console.log(all_ads, "all ads")

                    if (all_adsets.data.length !== 0) {
                        const current_ads = await profileCollection.findOne({ profile_id: ps.profile_id })
                        let update_ads = current_ads.ad || []

                        // Construct Adsets Data
                        const ad_container = all_ads.data.map((ad) => ({
                            ad_id: ad.id,
                            ad_name: ad.name,
                            adset_id: ad.adset_id,
                            ad_status: ad.effective_status,
                            ad_account_id: adaccount.id,
                        }));
                        
                        // Construct history documents for campaigns not already in the database
                        
                        const history_ad = ad_container.map((ad) => {
                            const group_adset = all_adsets.data.filter(adset => adset.id === ad.adset_id)
                            return {
                                ad_id: ad.id,
                                adset_id: ad.adset_id,
                                name: ad.name,
                                status: ad.effective_status,
                                budget: group_adset[0].daily_budget || 0,
                                reports: [],
                                category: "ad", 
                                profile_id: ps.profile_id,
                                adaccount: adaccount.id
                            }
                        });

                        const existingAdIds = await historyCollection
                                .find({ ad_id: { $in: ad_container.map((item) => item.ad_id) } })
                                .project({ ad_id: 1 })
                                .toArray();

                        const newAd = history_ad.filter(
                            (ad) => !existingAdIds.find((item) => item.ad_id === ad.ad_id)
                        );

                        if (newAd.length > 0) {
                            // Insert new campaigns in bulk
                            await historyCollection.bulkWrite(
                                newAd.map((ad) => ({
                                    insertOne: { document: ad },
                                }))
                            );
                        }

                        // console.log(ad_container, "AD")
                
                        ad_container.map((ad) => {
                            const filter = update_ads.filter(item => item.adset_id === ad.ad_id)
                            if(!filter.length) {
                                update_ads.push(ad)
                            }
                        })
                
                        // Update mongodb collections
                        await profileCollection.findOneAndUpdate(
                            {profile_id: ps.profile_id}, 
                            {$set: {ad: update_ads}}
                        );
                    }
                }))
            }
        }))

        // Close Connection to Database
	    client.close();
        res.json({ message: "Update Ads" })

    } catch (error) {
        res.json({ message: error })
    }

    // console.log(ps._id, clean_ad_campaigns, "CAMPAIGNS")
}