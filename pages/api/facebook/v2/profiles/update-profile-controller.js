
export default async function UpdateProfileController(req, res) {
    try {
        await Promise.all([
            await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/v2/profiles/update-business`),
            await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/facebook/v2/profiles/update-adaccount`)
        ])

       
        res.json({ message: "Update business and ad-accounts" }) 
    } catch (error) {
        res.json({ error })
    }
}