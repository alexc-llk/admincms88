import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function UpdateAdSet(req, res) {
    try {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase()
        const profileCollection = client.db().collection("profiles")
        const historyCollection = client.db().collection("fb-history")

        const data = req.body
        const { adaccount, access_token, profile_id } = data
        
        // Contruct Adset Data
        const qs = `access_token=${access_token}`

        
        let adset_container = []
        const adset_response = await axios.get(`https://graph.facebook.com/v16.0/${adaccount}/adsets?${qs}&fields=["name", "campaign_id", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`).catch(error => console.log(error))
        const all_adsets = adset_response.data

        // console.log(all_adsets, "all")

        if(all_adsets.data.length === 0) {
            return res.json({ message: "No active adsets found" })
        }

        const current_adsets = await profileCollection.findOne({ profile_id: profile_id })

        let update_adsets = current_adsets.adset || []

        // console.log(update_adsets, "adsets")

        // console.log(all_adsets.data, "ADSET ALL")
        await Promise.all(all_adsets.data.map(async adset => { 
            // console.log(insights.data, "INSIGHTS")
            const current_adset = {
                ad_account_id: adaccount,
                campaign_id: adset.campaign_id,
                adset_id: adset.id,
                adset_name: adset.name,
                adset_status: adset.effective_status
            }

            adset_container.push(current_adset)

            const history_adset = {
                adset_id: adset.id,
                name: adset.name,
                status: adset.effective_status,
                budget: adset.daily_budget || 0,
                reports: [],
                category: "adset", 
                profile_id: profile_id,
                adaccount: adaccount
            }

            const result = await historyCollection.find({adset_id: adset.id}).toArray()

            if(result.length === 0) {            
                await historyCollection.insertOne(history_adset)
            }
        }))
            
        // const clean_ad_adsets = ad_adsets.filter(adc => adc !== "empty")

        // console.log(adset_container, "ADSET")

        adset_container.map((adset) => {
            const filter = update_adsets.filter(ads => ads.adset_id === adset.adset_id)
            if(!filter.length) {
                update_adsets.push(adset)
            }
        })

        // Update mongodb collections
        await profileCollection.findOneAndUpdate(
            {profile_id: profile_id}, 
            {$set: {adset: update_adsets}}
        );

        // console.log(ps._id, clean_ad_adsets, "ADSETS")
        
        // Close Connection to Database
	    client.close();

        res.json({ success: true, message: "Update to Latest Adset", data: update_adsets });
    } catch (error) {
        res.json({ message: error })
    }
}