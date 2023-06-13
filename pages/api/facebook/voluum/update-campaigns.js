import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateCampaign(req, res) {
    try {
        let from
        // const startTime = performance.now()
        // 1. Establish Connection to Database
        // 2. Use Collection Voluum Campaign
        const client = await connectDatabase();
        const campaignCollections = client.db().collection("campaigns");
        const historyCollections = client.db().collection("fb-history");
        const profileCollection = client.db().collection("profiles");

        const data = req.body
        const { date, batch, voluum_data } = data

        // console.log(voluum_data, "data")

        const substractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        if(date === "today") {
            from = `${new Date().toISOString().slice(0, 10)}T00:00:00`
        } else if (date === "yesterday") {
            const formatTime = new Date().toISOString().slice(0, 10)
            from = `${substractDay(new Date(formatTime), 1).toISOString().slice(0, 10)}T00:00:00`
        } else {
            return "res.json({ error: `${date} parameters does not exist` })"
        }

        const profiles = await profileCollection.find({}, { skip: (batch - 1)*20, limit: 20 }).toArray()

        const result = await Promise.all(profiles.map(async ps => {
            let spending = 0, voluum_facebook

            const history = await historyCollections.find({ profile_id: ps.profile_id, category: "campaign" }).toArray()

            history.map(cp => {
                if(Array.isArray(cp.reports) && cp.reports) {
                    const date_report = cp.reports.filter(report => report.date === from)
                    if(date_report.length) {
                        spending += date_report[0].spend
                    }
                }
            })

            voluum_facebook = voluum_data.report

            let voluum_profile_campaigns = [], geo="", brand="", description= "", angle=[]

            voluum_facebook.map(cp => {
                let formatID, noFormatID
                const arr = cp.campaignName.split(" - ")

                if(arr.length > 3) {
                    const id = arr[3].split(" ")
                    formatID = id[0] + " " + id[1] + " " + id[2]
                    noFormatID = formatID.replaceAll(" ", "")
                } 

                if(noFormatID === ps.profile_id.replaceAll(" ", "")) {
                    voluum_profile_campaigns.push(cp)
                    geo = arr[1]
                    brand = arr[2]

                    const d = arr[3].replaceAll(`${formatID} `, "")
                    description = d.replaceAll(`${d?.split(" ")[0]} `, "")

                    arr[4]?.split("/").map(data => angle.push(data))
                } 
            })

            let today = {
                date: `${new Date(from.slice(0, 10)).toISOString().slice(0, 10)}T00:00:00`,
                voluum: voluum_profile_campaigns,
                spending: spending
            }

            // console.log(today, "today")

            const result = await campaignCollections.find({profile_id: ps.profile_id}).toArray()

            if(result[0]) {
                // console.log(result[0], "report exist")
                const check_date = result[0].reports.filter(report => report.date !== today.date)
                check_date.push(today)
                if (geo === "" && brand === "") {
                    await campaignCollections.findOneAndUpdate({profile_id: ps.profile_id}, {$set: { reports: check_date }})
                } else {
                    await campaignCollections.findOneAndUpdate({profile_id: ps.profile_id}, {$set: { reports: check_date, geo: geo, brand: brand, description: description, angle: angle }})
                }
            }
            
            return today
        }))
        

        // console.log(result, "RES update campaign")
        
        // const endTime = performance.now()
        // const responseTime = endTime - startTime;
        // console.log(`Response time: ${responseTime} milliseconds`)

        // Close Connection to Database
	    client.close();

        res.json({ message: "update campaigns" })
    } catch (error) {
        console.log(error)
        res.json({ message: "Fail to update campaign" })
    }
}