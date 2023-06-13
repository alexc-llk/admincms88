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
                let adsets = []
                const qs = `access_token=${profile[0].access_token}`

                // console.log(qs, "token")
                const adsets_response = await fetch(`https://graph.facebook.com/v17.0/${id.adaccount_id}/adsets?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
                const adsets_result = await adsets_response.json()

                if(adsets_result.data) {
                    adsets_result.data?.map(datapoint => {
                        adsets.push(datapoint)
                    })
                }

                if(adsets.length) {
                    await adaccountCollections.findOneAndUpdate({ adaccount_id: id.adaccount_id }, {$set: { adsets: adsets }})
                }  
            }
        }))

        client.close()

        res.json({ fb_adaccount })
    } catch (error) {
        res.json({ error })
    }
}