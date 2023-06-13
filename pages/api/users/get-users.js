import { connectDatabase } from "@/helpers/db-utils";

export default async function getUsers(req, res) {
    const client = await connectDatabase()
    const userCollection = client.db().collection("users")

    const allUser = await userCollection.find({}).project({password: 0, _id: 0}).toArray()

    res.json({ users: allUser })
}