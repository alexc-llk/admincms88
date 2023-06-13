import axios from "axios";

export default async function FacebookController(req, res) {
    try {
        const startTime = performance.now()

        const data = req.query

        // console.log(data, "data")

        await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/controller/facebook/history-today?group=${data.batch}`)
        await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/controller/facebook/voluum-today?group=${data.batch}`)

        const endTime = performance.now()
        const responseTime = endTime - startTime;

        const diagnostics = `Response time: ${responseTime} milliseconds`

        res.status(200).json({ message: diagnostics })
    } catch (error) {
        res.json({ error: `Update fail - ${error}`})
    }
}