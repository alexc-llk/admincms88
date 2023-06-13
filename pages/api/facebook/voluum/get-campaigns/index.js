import { connectDatabase } from "@/helpers/db-utils";

export default async function GetCampaigns(req, res) {
    // const startTime = performance.now()
    // 1. Establish Connection to Database
	// 2. Use Collection Voluum Campaign
	const client = await connectDatabase();
	const campaignCollections = client.db().collection("campaigns");
    const profileCollections = client.db().collection("profiles")

    const data = req.body

    const { date, batch } = data

    const profiles = await profileCollections.find({}, { skip: (Number(batch) - 1) * 2, limit: 2 }).toArray()

    // console.log(profiles.length, "PROFILES")

    try {
        // Generate Token
        const token_response = await fetch("https://api.voluum.com/auth/access/session", {
            method: "POST",
            body: JSON.stringify({
                accessId: process.env.NEXT_PUBLIC_VOLUUM_SECRET,
                accessKey: process.env.NEXT_PUBLIC_VOLUUM_KEY
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        const voluum_token = await token_response.json()

        const response = await fetch("https://api.voluum.com/campaign", { headers: { "CWAUTH-TOKEN": voluum_token.token }})
        const voluum_campaign = await response.json()

        // console.log(voluum_campaign.campaigns.length, "LEN")
        
        const substractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        // retrieve conversions report
        // parameters for conversions
        const column = "allConversionsRevenue,campaignId"
        let from
        
        if(date === "today") {
            from = `${new Date().toISOString().slice(0, 10)}T00:00:00`
        } else if (date === "yesterday") {
            const formatTime = new Date().toISOString().slice(0, 10)
            from = `${substractDay(new Date(formatTime), 1).toISOString().slice(0, 10)}T00:00:00`
        } else {
            return "res.json({ error: `${date} parameters does not exist` })"
        }

        const conv_response = await fetch(
            `https://api.voluum.com/report/conversions?column=${column}&tz=GMT&from=${from}&groupBy=campaign`, 
            { headers: { "CWAUTH-TOKEN": voluum_token.token }}
        )
        const conversions = await conv_response.json()

        // console.log(conversions, "CONV")

        profiles.map(async ps => {
            let profile_id = ""
            const qs = `access_token=${ps.access_token}`
            const date_preset = from.slice(0, 10)
            let today, spend = 0, conversion = 0, brand = "", geo = ""

            ps.profile_id.split(" ").map((chr) => {
                profile_id += chr
            })

            // Voluum for Conversions
            const profile_exist = await campaignCollections.find({ profile_id }).toArray()

            if (profile_exist.length === 0) {
                campaignCollections.insertOne({ profile_id, reports: [], geo: "", brand: "" })
            } else if (Array.isArray(profile_exist)) {
                geo = profile_exist[0].geo
                brand = profile_exist[0].brand
            }

            if(Array.isArray(voluum_campaign.campaign)) {
                voluum_campaign.campaigns.map(cp => {
                    let formatID
                    const arr = cp.name.split(" - ")

                    if(arr.length > 3) {
                        const id = arr[3].split(" ")
                        formatID = id[0] + id[1] + id[2]
                    } 
                
                    if(formatID === profile_id) {
                        // console.log(arr, "ARR")
                        geo = arr[1]
                        brand = arr[2]
                        
                        conversions.rows.map(cvsn => {
                            if (cp.id === cvsn.campaignId) {
                                conversion += cvsn.allConversionsRevenue
                            } 
                        })
                    }
                })
            } 

            // console.log(conversion, "CONVERSION")

            await Promise.all(ps.ad_account.map(async ad => {
                const campaigns_response = await fetch(`https://graph.facebook.com/v16.0/${ad.id}/campaigns?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
                const all_campaigns = await campaigns_response.json()

                
                
                if(Array.isArray(all_campaigns.data)) {
                    await Promise.all(all_campaigns.data.map(async campaign => {
                        
                        const insights_response = await fetch(
                            `https://graph.facebook.com/v16.0/${campaign.id}/insights?${qs}&
                            fields=["cost_per_inline_link_click", "inline_link_click_ctr", "spend", "clicks", "conversions"]&
                            time_range={since:"${date_preset}",until:"${date_preset}"}`
                        )
                        const insights = await insights_response.json()

                        // console.log(insights, "INSIGHTS")
    
                        if(insights.data) {
                            if(insights.data.length !== 0) {
                                spend += Number(insights.data[0].spend)
                            }
                        }
                    }))
                }
            }))

            today = {
                date: new Date(from.slice(0, 10)).toISOString(),
                spend,
                conversion
            }

            // console.log(today, "TODAY")

            // Check if data point exist
            const result = await campaignCollections.find({ profile_id }).toArray()
            const check_date = result[0].reports.filter(report => report.date !== today.date)
            check_date.push(today)
            await campaignCollections.findOneAndUpdate({ profile_id }, {$set: { reports: check_date, geo, brand }})
        })

        // const endTime = performance.now()
        // const responseTime = endTime - startTime;
        // console.log(`Response time: ${responseTime} milliseconds`)

        // Close Connection to Database
	    client.close();

        res.json({ message: "test" })
    } catch (error) {
        res.json({ error })
    }
}