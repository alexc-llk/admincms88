import axios from "axios"

export default async function VoluumToken(req, res) {
   try {
    const column = "cv,uniqueVisits,conversions,campaignName"

    const data = req.body
    const { date } = data

    // Generate Token
    const token_response = await axios.post("https://api.voluum.com/auth/access/session", {
        accessId: process.env.NEXT_PUBLIC_VOLUUM_SECRET,
        accessKey: process.env.NEXT_PUBLIC_VOLUUM_KEY
    })
    const voluum_token = await token_response.data

    // console.log(date, "DATE")

    const conv_response = await axios(
        `https://api.voluum.com/report?tz=GMT&from=${date}&groupBy=campaign&column=${column}&sort=conversions&include=ACTIVE&direction=DESC&limit=1500`, 
        { headers: { "CWAUTH-TOKEN": voluum_token.token }}
    )
    const voluum_report = await conv_response.data
    const voluum_facebook = voluum_report.rows.filter(cp => cp.campaignName.includes("Facebook"))

    res.json({ report: voluum_facebook })
   } catch (error) {
    console.log(error)
    res.json({ message: error })
   }
}