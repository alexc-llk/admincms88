import { connectDatabase } from "@/helpers/db-utils";

export default async function updateBusinessAccount(req, res) {
	// 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const profileCollection = client.db().collection("profiles");

    try {
		// Retrieve content from Collection
		const profiles = await profileCollection.find({}, { projection: { profile_id: 1, access_token: 1 } }).toArray();

    await Promise.all(profiles.map(async profile => {
      // Update BM & Ad Accounts
      const qs = `access_token=${profile.access_token}`

      let main_manager, ma

      const response = await fetch(`https://graph.facebook.com/v16.0/me?${qs}`)
 
      if(response.status === 200) {
        await profileCollection.findOneAndUpdate({profile_id: profile.profile_id}, {$set: { valid_token: true }});
        
          // Retrieve main account
          const accounts_response = await fetch(`https://graph.facebook.com/v16.0/me?${qs}`)
          const accounts_result = await accounts_response.json()

          // console.log(accounts_result, "account")

          ma = accounts_result
          main_manager = {
            name: ma.name,
            id: ma.id,
            bm_account_status: "",
            bm_account_disabled_at: "",
            bm_account_verification_status: "",
          };
        
          // Retrieve all ad accounts
          const adaccounts_response = await fetch(`https://graph.facebook.com/v16.0/me/adaccounts?${qs}&fields=["id", "name", "account_status", "business", "timezone_name"]`)
          const adaccounts_result = await adaccounts_response.json() 

          // console.log(result, "result")

          // Check business status
          const business_response = await fetch(`https://graph.facebook.com/v16.0/me/businesses?${qs}&fields=["verification_status", "name"]`)
          const business_result = await business_response.json()

          // console.log(business_stat)

  
          let bm_accounts = [main_manager]
          let ad_accounts = []
    
          if(adaccounts_result.data) {
            for (const data of adaccounts_result.data) {
              if (data.business) {
                let business_account;
                for (const biz of business_result.data) {
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

            // Update mongodb collections
            await profileCollection.findOneAndUpdate(
              {profile_id: profile.profile_id}, 
              {$set: {bm_account: bm_accounts, ad_account: ad_accounts}}
            );
        } else {
          await profileCollection.findOneAndUpdate({profile_id: profile.profile_id}, {$set: { valid_token: false }});
        }
      }
    }))

    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/bulk-update-camp`),
      fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/bulk-update-adset`),
      fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/bm_accounts/bulk-update-ad`)
    ])

		// Close Connection to Database
    client.close();

		// Return Response
		res.status(200).json({ success: true, message: "Update Latest Content" });
	} catch (error) {
		// console.log(error)
		client.close()
		res.json({ success: false, message: error });
	}
}