import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function UpdateAd(req, res) {
    // 1. Establish Connection to Database
	// 2. Use Collection Profiles
    const client = await connectDatabase()
    const profileCollection = client.db().collection("profiles")
    const historyCollection = client.db().collection("fb-history")

    const data = req.body
    const { adaccount, access_token, profile_id } = data

    // Contruct Adset Data
    const qs = `access_token=${access_token}`
    
    let ad_container = []
    const ad_response = await axios.get(`https://graph.facebook.com/v16.0/${adaccount}/ads?${qs}&fields=["name", "adset_id", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`).catch(error => console.log(error))
    const adset_response = await axios.get(`https://graph.facebook.com/v16.0/${adaccount}/adsets?${qs}&fields=["name", "adset_id", "daily_budget"]&date_preset=today`).catch(error => console.log(error))
    const all_ads = ad_response.data
    const all_adsets = adset_response.data

    // console.log(all_adsets.data, "ADSET ALL")

    if (all_adsets.data.length === 0) {
        return res.json({ message: "No active ads found" })
    }

    const current_ads = await profileCollection.findOne({ profile_id: profile_id })

    let update_ads = current_ads.ad || []
    
    await Promise.all(all_ads.data.map(async ad => { 
        const group_adset = all_adsets.data.filter(adset => adset.id === ad.adset_id)

        // console.log(group_adset, "GROUP")

        const current_ad = {
            ad_account_id: adaccount,
            adset_id: ad.adset_id,
            ad_id: ad.id,
            ad_name: ad.name,
            ad_status: ad.effective_status,
        }

        ad_container.push(current_ad)

        const history_ad = {
            adacc_id: adaccount,
            ad_id: ad.id,
            adset_id: ad.adset_id,
            name: ad.name,
            status: ad.effective_status,
            budget: group_adset[0].daily_budget || 0,
            reports: [],
            category: "ad", 
            profile_id: profile_id,
            adaccount: adaccount
        }

        const result = await historyCollection.find({ad_id: ad.id}).toArray()

        // console.log(history_ad, "HISTORY")

        // console.log(ad.id, !result.length, "RESULT")

        if(Array.isArray(result) && !result.length) {            
            await historyCollection.insertOne(history_ad)
        } 
    }))

    ad_container.map((ad) => {
        const filter = update_ads.filter(item => item.ad_id === ad.ad_id)
        if(!filter.length) {
            update_ads.push(ad)
        }
    })
        

    // Update mongodb collections
    await profileCollection.findOneAndUpdate(
        { profile_id: profile_id }, 
        { $set: {ad: update_ads} }
    );

    // Close Connection to Database
    client.close();

    res.json({ success: true, message: "Update to Latest Ad", data: update_ads });
}