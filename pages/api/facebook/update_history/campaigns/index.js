import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function UpdateCampaigns(req, res) {
    try {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase()
        const profileCollection = client.db().collection("profiles")
        const profileHistory = client.db().collection("fb-history")

        const data = req.body
        const { date, batch } = data

        // Retrive token from profiles
        const profiles = await profileCollection.find({ valid_token: true }, { skip: (batch - 1)*20, limit: 20 }).toArray()

        // console.log(profiles.length, batch, "profiles")

        let date_preset

        if(date === "today" || date === "yesterday") {
            date_preset = date
        } else {
            return res.json({ error: `${date} parameter does not exist`})
        }

        const subtractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        await Promise.all(profiles.map(async ps => {
            // Check token validity
            const response = await fetch(`https://graph.facebook.com/v16.0/me?access_token=${ps.access_token}`)

            if (response.status !== 200) {
                await profileCollection.findOneAndUpdate({profile_id: ps.profile_id}, {$set: {valid_token: false }});
                return
            }

            // console.log(ps.profile_id, batch, "data")

            const qs = `access_token=${ps.access_token}`

            await Promise.all(ps.ad_account.map(async ad => {
                const campaigns_response = await axios(`https://graph.facebook.com/v16.0/${ad.id}/campaigns?${qs}&fields=["name", "effective_status", "buying_type", "spend_cap", "daily_budget"]&date_preset=today`)
                const all_campaigns = campaigns_response.data

                await Promise.all(all_campaigns.data.map(async campaign => {
                    let today

                    const insights_response = await axios(
                        `https://graph.facebook.com/v16.0/${campaign.id}/insights?${qs}&
                        fields=["cost_per_inline_link_click", "inline_link_click_ctr", "spend", "clicks", "conversions"]&
                        date_preset=${date_preset}`
                    )
                    const insights = insights_response.data

                    // console.log(insights, ps.profile_id)

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

                    const result = await profileHistory.find({ campaign_id: campaign.id }).toArray();
                    const check_date = result[0]?.reports?.filter(report => report.date !== today.date) || [];
                    check_date.push(today);
                    await profileHistory.findOneAndUpdate({ campaign_id: campaign.id }, { $set: { reports: check_date } });

                    // console.log(campaign.id, check_date, "entry")
                }))
            }))
        }))

        // Close Connection to Database
	    client.close();

        res.json({ success: true, message: "Updated today's campaign report" });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error })
    }
}