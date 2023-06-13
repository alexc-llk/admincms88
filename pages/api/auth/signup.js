import { connectDatabase } from "@/helpers/db-utils";
import { hash } from "bcryptjs"

export default async function handler(req, res) {
    // 1. Establish Connection to Database
	// 2. Use Collection Profiles
	const client = await connectDatabase();
	const usersCollection = client.db().collection("users");

    if(req.method === 'POST') {
        if(!req.body) return res.status(404).json({ error: "Don't have form data...!" })
        const { email, password, role } = req.body

        // check dupes
        const checkexisting = await usersCollection.findOne({ email })
        if(checkexisting) return res.status(422).json({ message: "User already exists...!" })

        // hash password
        try {
            const hashed_password = await hash(password, 12)
            const data = await usersCollection.insertOne({ email, password: hashed_password, role })
            res.status(201).json({ status: true, user: data })
        } catch (err) {
            console.log(err)
            return res.status(404).json({ err })
        }
    } else {
        res.status(500).json({ message: "invalid HTTP request, only POST accepted"})
    }
}