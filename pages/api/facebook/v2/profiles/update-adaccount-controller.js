import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateProfileController(req, res) {
    try {
        const client = await connectDatabase()
        const adaccountCollections = client.db().collection("fb-adaccount")

        const fb_adaccount = await adaccountCollections.countDocuments()
        const batches = Math.ceil(fb_adaccount / 1000)

        for( let i = 0; i < batches; i++) {
            fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/v2/profiles/update-campaigns`, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ batch: i }),
            })

            fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/v2/profiles/update-adsets`, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ batch: i }),
            })

            fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/v2/profiles/update-ads`, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ batch: i }),
            })
        }

        client.close()
        
        res.json({ message: "Update campaigns, adsets and ads" }) 
    } catch (error) {
        res.json({ error })
    }
}