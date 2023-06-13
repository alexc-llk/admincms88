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
                        const campaigns_response = await fetch(`https://graph.facebook.com/v16.0/${adaccount.id}/campaigns?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
                        const all_campaigns = await campaigns_response.json()

                        // console.log(all_campaigns, "campaigns")

                        if(all_campaigns.data.length !== 0) {
                            const current_campaigns = await profileCollection.findOne({ profile_id: ps.profile_id })
                            let update_campaigns = current_campaigns.campaign || []

                            // Construct Campaigns Data
                            const campaign_container = all_campaigns.data.map((campaign) => ({
                                campaign_id: campaign.id,
                                campaign_name: campaign.name,
                                campaign_status: campaign.effective_status,
                                ad_account_id: adaccount.id,
                            }));

                            // Construct history documents for campaigns not already in the database
                            const history_campaigns = campaign_container.map((campaign) => ({
                                campaign_id: campaign.campaign_id,
                                name: campaign.campaign_name,
                                status: campaign.campaign_status,
                                budget: campaign.daily_budget || 0,
                                reports: [],
                                category: "campaign",
                                profile_id: ps.profile_id,
                                adaccount: adaccount.id,
                            }));

                            const existingCampaignIds = await historyCollection
                                .find({ campaign_id: { $in: campaign_container.map((c) => c.campaign_id) } })
                                .project({ campaign_id: 1 })
                                .toArray();

                            const newCampaigns = history_campaigns.filter(
                                (campaign) => !existingCampaignIds.find((c) => c.campaign_id === campaign.campaign_id)
                            );

                            if (newCampaigns.length > 0) {
                                // Insert new campaigns in bulk
                                await historyCollection.bulkWrite(
                                    newCampaigns.map((campaign) => ({
                                        insertOne: { document: campaign },
                                    }))
                                );
                            }

                            // console.log(campaign_container, "container")

                            campaign_container.map((campaign) => {
                                const filter = update_campaigns.filter(cp => cp.campaign_id === campaign.campaign_id)
                                if(!filter.length) {
                                    update_campaigns.push(campaign)
                                }
                            })

                            // Update profile collection with latest campaigns
                            await profileCollection.findOneAndUpdate(
                                { profile_id: ps.profile_id },
                                { $set: { campaign: update_campaigns } }
                            );
                        }
                }))
            }
        }))

        // Close Connection to Database
	    client.close();
        res.json({ message: "Update Campaigns" })

    } catch (error) {
        res.json({ message: error })
    }

    // console.log(ps._id, clean_ad_campaigns, "CAMPAIGNS")
}