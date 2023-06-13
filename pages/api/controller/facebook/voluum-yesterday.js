import axios from "axios";

export default async function FacebookController(req, res) {
    try {
        const startTime = performance.now()

        const data = req.query

        const formatTime = `${new Date().toISOString().slice(0, 10)}`

        const substractDay = (date, days) => {
            date.setDate(date.getDate() - days);
            return date;
        }

        const voluum_response = await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/voluum/get-conversion`, {
            date: substractDay(new Date(formatTime), 1).toISOString().slice(0, 19)
        })
        const voluum_data = await voluum_response.data

        const batches = Math.ceil(240 / 20)

        await Promise.all(Array.apply(0, { length: batches }).map(async (_, index) => {
            await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/voluum/update-campaigns`, {
                batch: index + 1 + (Number(data.group)*12),
                date: "yesterday",
                voluum_data: voluum_data
            })
        }))

        const endTime = performance.now()
        const responseTime = endTime - startTime;

        const diagnostics = `Response time: ${responseTime} milliseconds`

        res.status(200).json({ message: diagnostics, voluum_data })
    } catch (error) {
        res.json({ message: `${error}` })
    }
}