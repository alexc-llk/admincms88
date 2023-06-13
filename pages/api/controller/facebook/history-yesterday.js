import axios from "axios";

export default async function FacebookController(req, res) {
  try {
    const startTime = performance.now();

    const data = req.query

    const batches = Math.ceil(240 / 20);

    const apiCalls = [];
    for (let i = 1; i <= batches; i++) {
      // console.log(i + (Number(data.group)*15))
      apiCalls.push(
        axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/update_history/campaigns`, {
          batch: i + (Number(data.group)*12),
          date: "yesterday"
        }),
        axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/update_history/adsets`, {
          batch: i + (Number(data.group)*12),
          date: "yesterday"
        }),
        axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/update_history/ads`, {
          batch: i + (Number(data.group)*12),
          date: "yesterday"
        })
      );
    }

    await Promise.all(apiCalls); // Wait for all API calls to complete

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const diagnostics = `Response time: ${responseTime} milliseconds`;

    res.status(200).json({ message: diagnostics });
  } catch (error) {
    res.json({ message: `${error}` });
  }
}
