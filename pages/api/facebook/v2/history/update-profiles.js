import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateHistory(req, res) {
    try {
        const client = await connectDatabase()
        const profileCollection = client.db().collection("profiles")
        const adaccountCollections = client.db().collection("fb-adaccount")
        const profileHistoryCollection = client.db().collection("fbh-profiles")

        const data = req.body
        // const { batch, start_date, end_date, date_preset } = data
        const { batch, voluum_data, start_date, end_date, date_preset } = data

        console.log(`updating batch ${batch}`)

        const subtractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        let arr_of_profile_id = []

        // Test Single Call Only
        // let time_range

        // Test Single Call Only
        // if (date_preset === "today") {
        //     time_range = `${new Date().toISOString().slice(0, 10)}T00:00:00`
        // } else if (date_preset === "yesterday") {
        //     const formatTime = new Date().toISOString().slice(0, 10)
        //     time_range = `${subtractDay(new Date(formatTime), 1).toISOString().slice(0, 10)}T00:00:00`
        // }

        // Test Single Call Only
        // const voluum_response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/voluum/get-conversion`, {
        //     method: "POST", // or 'PUT'
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ date:  time_range}),
        // })

        // const voluum_data = await voluum_response.json()

        const profiles = await profileCollection.find({}, { skip: (batch)*50, limit: 50 }).project({ profile_id: 1, access_token: 1 }).toArray()
        profiles.map(ps => {
            arr_of_profile_id.push(ps.profile_id)
        })
        const fb_adaccount = await adaccountCollections.find({ profile_id: { $in: arr_of_profile_id }}).toArray()

        

        await Promise.all(profiles.map(async (ps) => {
            let total_spend = 0

            const qs = `access_token=${ps.access_token}`

            const adaccount = fb_adaccount.filter(data => data.profile_id === ps.profile_id)

            await Promise.all(adaccount.map(async (item) => {
                await Promise.all(item.campaigns.map(async (cp) => {
                    // console.log(cp, "cp")
                    const insights_response = await fetch (`https://graph.facebook.com/v17.0/${cp.id}/insights?fields=["spend","campaign_id","adset_id","ad_id","cost_per_inline_link_click","inline_link_click_ctr"]&${qs}&date_preset=${date_preset}&action_report_time=conversion`)
                    const insights_result = await insights_response.json()

                    // console.log(insights_result, "insights")

                    if(insights_result.data) {
                        insights_result.data?.map(info => {
                            // console.log(info.spend, "spend")
                            total_spend += Number(info.spend)
                        })
                    }
                    
                }))
                
            }))

            const voluum_facebook = voluum_data.report
            let conversion=0, cv=0, uniqueVisits=0, geo="", brand="", description= "", angle=[]

            // console.log(voluum_facebook)

            voluum_facebook.map(cp => {
                let formatID, noFormatID
                const arr = cp.campaignName.split(" - ")

                if(arr.length > 3) {
                    const id = arr[3].split(" ")
                    formatID = id[0] + " " + id[1] + " " + id[2]
                    noFormatID = formatID.replaceAll(" ", "")
                } 

                if(noFormatID === ps.profile_id.replaceAll(" ", "")) {
                    geo = arr[1]
                    brand = arr[2]
                    conversion += Number(cp.conversions)
                    cv += Number(cp.cv)
                    uniqueVisits += Number(cp.uniqueVisits)

                    const d = arr[3].replaceAll(`${formatID} `, "")
                    description = d.replaceAll(`${d?.split(" ")[0]} `, "")

                    arr[4]?.split("/").map(data => angle.push(data))
                } 
            })

            // console.log(ps.profile_id, total_spend, conversion, cv, uniqueVisits, geo, brand, description, angle, "voluum")

            let time_range
    
            if (date_preset === "today") {
                time_range = `${new Date().toISOString().slice(0, 10)}T00:00:00`
            } else if (date_preset === "yesterday") {
                const formatTime = new Date().toISOString().slice(0, 10)
                time_range = `${subtractDay(new Date(formatTime), 1).toISOString().slice(0, 10)}T00:00:00`
            }

            console.log(total_spend, uniqueVisits, cv, ps.profile_id)

            const day = {
                date: time_range,
                total_spend: total_spend, 
                conversion: conversion, 
                cv: cv, 
                uniqueVisits: uniqueVisits, 
                geo: geo, 
                brand: brand,
                description: description, 
                angle: angle
            }

            const exist = await profileHistoryCollection.find({ profile_id: ps.profile_id }).toArray()

            if(!exist.length) {
                const reports = [day]
                await profileHistoryCollection.insertOne({ profile_id: ps.profile_id, reports })
            } else {
                const check_date = exist[0].reports.filter(report => report.date !== day.date)
                check_date.push(day)
                await profileHistoryCollection.findOneAndUpdate({ profile_id: ps.profile_id }, { $set: { reports: check_date } })
            }

            // console.log(ps.profile_id, total_spend, "total spend")
        }))

        client.close()

        res.json({ message: `Update batch number ${batch}`, voluum_data: voluum_data.report })
    } catch (error) {
        res.json({ error })
    }
}