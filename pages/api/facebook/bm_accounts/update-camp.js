import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function UpdateCampaigns(req, res) {
    try {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase();
        const profileCollection = client.db().collection("profiles");
        const historyCollection = client.db().collection("fb-history")

        const data = req.body
        const { adaccount, access_token, profile_id } = data

        // Construct Campaigns Data
        
        const qs = `access_token=${access_token}`

        const campaigns_response = await axios(`https://graph.facebook.com/v16.0/${adaccount}/campaigns?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
        const all_campaigns = campaigns_response.data

        if(all_campaigns.data.length === 0) {
            return
        }

        // console.log(all_campaigns.data, "CAMP")

        const current_campaigns = await profileCollection.findOne({ profile_id: profile_id })

        let update_campaigns = current_campaigns.campaign || []

        // Construct Campaigns Data
        const campaign_container = all_campaigns.data.map((campaign) => ({
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            campaign_status: campaign.effective_status,
            ad_account_id: adaccount,
        }));
        
        // Construct history documents for campaigns not already in the database
        const history_campaigns = campaign_container.map((campaign) => ({
            campaign_id: campaign.campaign_id,
            name: campaign.campaign_name,
            status: campaign.campaign_status,
            budget: campaign.daily_budget || 0,
            reports: [],
            category: "campaign",
            profile_id: profile_id,
            adaccount: adaccount,
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
            { profile_id: profile_id },
            { $set: { campaign: update_campaigns } }
        );

        // console.log(update_campaigns, "update")
        
        // Close Connection to Database
	    client.close();

        res.json({ success: true, message: "Update to Latest Campaigns", data: update_campaigns})

    } catch (error) {
        res.json({ message: error })
    }

    // console.log(ps._id, clean_ad_campaigns, "CAMPAIGNS")
}