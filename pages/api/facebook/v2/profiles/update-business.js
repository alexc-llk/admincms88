import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateBusiness(req, res) {
    try {
        // Establish Connection to Database
        const client = await connectDatabase();
        const profileCollections = client.db().collection("profiles");
        const businessCollections = client.db().collection("fb-business")

        const profiles = await profileCollections.find({}).project({ profile_id: 1, access_token: 1 }).toArray()
        
        await Promise.all(profiles.map(async (ps) => {
            // console.log(ps.profile_id, "profile")
            const qs = `access_token=${ps.access_token}`
            const bm_response = await fetch(`https://graph.facebook.com/v17.0/me?${qs}`)
            const bm_result = await bm_response.json()

            const adaccount_response = await fetch(`https://graph.facebook.com/v17.0/me/adaccounts?${qs}&fields=["id", "name", "account_status", "business", "timezone_name"]`)
            const adaccount_result = await adaccount_response.json()

            let business = []

            if(!bm_result.error) {
                business.push({
                    bm_id: bm_result.id,
                    bm_name: bm_result.name,
                    ad_account: []
                })
                adaccount_result.data?.map((adaccount) => {
                    if(adaccount.business) {
                        business.push({
                            bm_id: adaccount.business.id,
                            bm_name: adaccount.business.name,
                            ad_account: []
                        })
                    }
                })

                business.map((biz) => {
                    adaccount_result.data?.map(adaccount => {
                        if(adaccount.business) {
                            biz.ad_account.push({ adaccount_id: adaccount.id, adaccount_name: adaccount.name })
                        } else {
                            business[0].ad_account.push({ adaccount_id: adaccount.id, adaccount_name: adaccount.name })
                        }
                    })
                })
                
                const exist = await businessCollections.find({ profile_id: ps.profile_id }).toArray()
                
                if(!exist.length) {
                    await businessCollections.insertOne({ profile_id: ps.profile_id, business: business })
                } else {
                    await businessCollections.findOneAndUpdate({ profile_id: ps.profile_id }, { $set: { business: business }})
                }

                await profileCollections.findOneAndUpdate({profile_id: ps.profile_id}, {$set: { valid_token: true }});
            } else {
                await profileCollections.findOneAndUpdate({profile_id: ps.profile_id}, {$set: { valid_token: false }});
            }
        }))

        client.close()

        res.status(200).json({ message: "Successfully update business accounts" })
    } catch (error) {
        res.status(404).json({ error })
    }
}