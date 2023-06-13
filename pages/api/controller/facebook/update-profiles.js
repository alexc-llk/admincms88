import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function FacebookController(req, res) {
  try {
    const startTime = performance.now();

    // Establish Connection to Database
    const client = await connectDatabase();
    const profileCollections = client.db().collection("profiles");
    const campaignCollections = client.db().collection("campaigns");

    // Fetch analytics from the campaign collection
    const analytics = await campaignCollections.find({}).toArray();

    // console.log(batches)

    // Retrieve profiles from the profile collection
    const profiles = await profileCollections
      .find({})
      .project({ profile_id: 1, access_token: 1 })
      .toArray();

    // Call the update-bm API endpoint for each profile asynchronously
    await Promise.all(
      profiles.map(async (profile) => {
        const exist = analytics.filter(item => item.profile_id === profile.profile_id)
        if(!exist.length) {
            await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/voluum/create-campaign`, {
                profile_id: profile.profile_id
            })
        }
      })
    );
    
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/daily_update`)
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    const diagnostics = `Response time: ${responseTime} milliseconds`;

    // Close Connection to Database
    client.close();

    res.status(200).json({ message: "working", diagnostics });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
}
