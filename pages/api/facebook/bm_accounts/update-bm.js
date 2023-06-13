import { connectDatabase } from "@/helpers/db-utils";
import axios from "axios";

export default async function updateBusinessAccount(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

    try {
		

		const data = req.body
		const { profile_id } = data

		// Retrieve content from Collection
		const profile = await profileCollection.findOne({ profile_id: profile_id }, { projection: { profile_id: 1, access_token: 1 } });

		if (!profile) {
			return res.json({ error: "profile does not exist" })
		}

		// Update BM & Ad Accounts
		const qs = `access_token=${profile.access_token}`

		let main_manager, result, business_stat, ma

		const response = await axios(`https://graph.facebook.com/v16.0/me?${qs}`)
		if(response.status === 200) {
			await profileCollection.findOneAndUpdate({profile_id: data.profile_id}, {$set: { valid_token: true }});
		} else {
			await profileCollection.findOneAndUpdate({profile_id: data.profile_id}, {$set: { valid_token: false }});
			return
		}

		await Promise.all([
			// Retrieve main account
			axios
				.get(`https://graph.facebook.com/v16.0/me?${qs}`)
				.then((main_account) => {
					ma = main_account.data;
					main_manager = {
						name: ma.name,
						id: ma.id,
						bm_account_status: "",
						bm_account_disabled_at: "",
						bm_account_verification_status: "",
					};
				}),
		
			// Retrieve all ad accounts
			axios
				.get(
				`https://graph.facebook.com/v16.0/me/adaccounts?${qs}&fields=["id", "name", "account_status", "business", "timezone_name"]`
				)
				.then((response) => {
					result = response.data;
				}),
		
			// Check business status
			axios
				.get(
				`https://graph.facebook.com/v16.0/me/businesses?${qs}&fields=["verification_status", "name"]`
				)
				.then((bms_response) => {
					business_stat = bms_response.data;
				}),
		]);

		let bm_accounts = [main_manager]
		let ad_accounts = []

		if(result.data) {
			for (const data of result.data) {
				if (data.business) {
					let business_account;
					for (const biz of business_stat.data) {
					if (data.business.name === biz.name) {
						business_account = {
						name: data.business.name,
						id: data.business.id,
						bm_account_status: "",
						bm_account_disabled_at: "",
						bm_account_verification_status: biz.verification_status,
						};
					}
					}
				
					bm_accounts.push(business_account);
					ad_accounts.push({ ...data, bm_account_id: data.business.id });
				} else {
					ad_accounts.push({ ...data, bm_account_id: ma.id });
				}
			}

			

			await Promise.all(result.data.map(async ad => {
				// Update Campaign
				await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/update-camp`, {
					adaccount: ad.id,
					access_token: profile.access_token,
					profile_id: profile_id
				})

				// Update Adset
				await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/update-adset`, {
					adaccount: ad.id,
					access_token: profile.access_token,
					profile_id: profile_id
				})
				
				// Update Ad
				await axios.post(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/update-ad`, {
					adaccount: ad.id,
					access_token: profile.access_token,
					profile_id: profile_id
				})
				
				// console.log(ad.id, profile.access_token, "ID")
			}))
		}
		
		// Update mongodb collections
		await profileCollection.findOneAndUpdate(
			{profile_id: profile_id}, 
			{$set: {bm_account: bm_accounts, ad_account: ad_accounts}}
		);

		// Close Connection to Database
	    client.close();

		// Return Response
		res.status(200).json({ success: true, message: "Update Latest Content", profile });
	} catch (error) {
		// console.log(error)
		client.close()
		res.json({ success: false, message: error });
	}
}