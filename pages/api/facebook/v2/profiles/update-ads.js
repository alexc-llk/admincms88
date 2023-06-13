import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateAdaccount(req, res) {
    try {
        const client = await connectDatabase()
        const profileCollections = client.db().collection("profiles")
        const adaccountCollections = client.db().collection("fb-adaccount")

        const data = req.body
        const { batch } = data

        const profiles = await profileCollections.find({}).project({ profile_id: 1, access_token: 1 }).toArray()
        const fb_adaccount = await adaccountCollections.find({}, { skip: (batch)*1000, limit: 1000 }).toArray()

        // console.log(profiles, "profile")

        await Promise.all(fb_adaccount?.map(async (id) => {
            const profile = profiles.filter((profile) => profile.profile_id === id.profile_id)
            if(profile.length) {
                let ads = []
                const qs = `access_token=${profile[0].access_token}`

                // console.log(qs, "token")
                const ads_response = await fetch(`https://graph.facebook.com/v17.0/${id.adaccount_id}/ads?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
                const ads_result = await ads_response.json()

                if(ads_result.data) {
                    ads_result.data?.map(datapoint => {
                        ads.push(datapoint)
                    })
                }

                if(ads.length) {
                    await adaccountCollections.findOneAndUpdate({ adaccount_id: id.adaccount_id }, {$set: { ads: ads }})
                }  
            }
        }))

        client.close()

        res.json({ fb_adaccount })
    } catch (error) {
        res.json({ error })
    }
}