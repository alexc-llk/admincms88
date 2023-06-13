import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateAdaccount(req, res) {
    try {
        const client = await connectDatabase()
        const profileCollections = client.db().collection("profiles");
        const businessCollections = client.db().collection("fb-business")
        const adaccountCollections = client.db().collection("fb-adaccount")

        const fb_business = await businessCollections.find({}).toArray()
        const profiles = await profileCollections.find({}).project({ profile_id: 1, access_token: 1 }).toArray()

        // console.log(profiles, "profile")

        await Promise.all(fb_business.map(async (biz) => {
            const profile = profiles.filter((profile) => profile.profile_id === biz.profile_id)

            if(profile.length) {
                await Promise.all(biz.business?.map(async (adaccount) => {
                    // console.log(adaccount, "adaccount")

                    await Promise.all(adaccount.ad_account?.map(async (id) => {
                        // console.log(id, "adaccount")
                        const exist = await adaccountCollections.find({ adaccount_id: id.adaccount_id }).toArray()

                        if(!exist.length) {
                            await adaccountCollections.insertOne({ profile_id: biz.profile_id, adaccount_id: id.adaccount_id, campaigns: [], adsets: [], ads: [] })
                        } 
                    }))
                }))
                    
            }
            
        }))

        client.close()

        res.json({ fb_business })
    } catch (error) {
        res.json({ error })
    }
}