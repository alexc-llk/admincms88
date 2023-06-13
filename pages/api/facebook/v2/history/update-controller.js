import { connectDatabase } from "@/helpers/db-utils";

export default async function UpdateHistory(req, res) {
    try {
        const { start_date, end_date, date_preset } = req.query

        const client = await connectDatabase()
        const profileCollection = client.db().collection("profiles")

        const totalProfiles = await profileCollection.countDocuments()
        const batches = Math.ceil(totalProfiles / 50)

        const subtractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        let time_range

        if (date_preset === "today") {
            time_range = `${new Date().toISOString().slice(0, 10)}T00:00:00`
        } else if (date_preset === "yesterday") {
            const formatTime = new Date().toISOString().slice(0, 10)
            time_range = `${subtractDay(new Date(formatTime), 1).toISOString().slice(0, 10)}T00:00:00`
        }

        const voluum_response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/voluum/get-conversion`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:  time_range}),
        })

        // console.log(time_range)

        const voluum_data = await voluum_response.json()

        for( let i = 0; i < batches; i++) {
            fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/v2/history/update-profiles`, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ batch: i, voluum_data: voluum_data, start_date, end_date, date_preset }),
            })
        }

        client.close()

        res.json({ message: "Update batches of history"})
    } catch (error) {
        res.json({ error })
    }
}