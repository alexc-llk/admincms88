import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function UpdateAds (req, res) {
    try {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase()
        const profileCollection = client.db().collection("profiles")
        const profileHistory = client.db().collection("fb-history")

        const { date, batch } = req.body

        // Retrive token from profiles
        const profiles = await profileCollection.find({ valid_token: true }, { skip: (batch - 1)*20, limit: 20 }).toArray()

        let date_preset, ads = []

        const subtractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        if(date === "today" || date === "yesterday") {
            date_preset = date
        } else {
            return res.json({ error: `${date} parameter does not exist`})
        }

        await Promise.all(profiles.map(async ps => {
            const qs = `access_token=${ps.access_token}`

            // Check token validity
            const response = await fetch(`https://graph.facebook.com/v16.0/me?access_token=${ps.access_token}`)

            if (response.status !== 200) {
                await profileCollection.findOneAndUpdate({profile_id: ps.profile_id}, {$set: {valid_token: false }});
                return
            }

            await Promise.all(ps.ad_account.map(async ad => {
                const ads_response = await axios(`https://graph.facebook.com/v16.0/${ad.id}/ads?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
                const all_ads = ads_response.data

                all_ads.data && await Promise.all(all_ads.data.map(async ad => {
                    let today
                    
                    const insights_response = await axios(
                        `https://graph.facebook.com/v16.0/${ad.id}/insights?${qs}&
                        fields=["cost_per_inline_link_click", "inline_link_click_ctr", "spend", "clicks", "conversions"]&
                        date_preset=${date_preset}`
                        )
                    const insights = insights_response.data

                    // console.log(insights, "INSIGHTS")
                    
                    if(Array.isArray(insights.data) && insights.data.length) {
                        today = {
                                    date: `${new Date(insights.data[0].date_start).toISOString().slice(0, 10)}T00:00:00`,
                                    cpc: Number(insights.data[0].cost_per_inline_link_click) || 0,
                                    ctr: Number(insights.data[0].inline_link_click_ctr) || 0,
                                    spend: Number(insights.data[0].spend) || 0,
                                    clicks: Number(insights.data[0].clicks) || 0
                                }
                    } else {
                        let newDate
                        if (date_preset === "today") {
                            newDate = `${new Date().toISOString().slice(0, 10)}T00:00:00`
                        } else if (date_preset === "yesterday") {
                            const formatTime = new Date().toISOString().slice(0, 10)
                            newDate = `${subtractDay(new Date(formatTime), 1).toISOString().slice(0, 10)}T00:00:00`
                        }
                        today = {
                            date: newDate,
                            cpc: 0,
                            ctr: 0,
                            spend: 0,
                            clicks: 0
                        }
                    }

                    const result = await profileHistory.find({ad_id: ad.id}).toArray()
                    const check_date = result[0].reports.filter(report => report.date !== today.date)
                    check_date.push(today)
                    await profileHistory.findOneAndUpdate({ad_id: ad.id}, {$set: { reports: check_date }})
                }))
            }))
        }))

        // Close Connection to Database
	    client.close();

        res.json({ success: true, message: "Updated ad today's report", reports: ads });
    } catch (error) {
        res.json({ success: false, message: error })
    }
}