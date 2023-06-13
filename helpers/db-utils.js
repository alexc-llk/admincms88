const { MongoClient } = require("mongodb");

const connectDatabase = async () => {
	const client = await MongoClient.connect(
		process.env.NEXT_PUBLIC_CONNECTIONSTRING,
		{
			useUnifiedTopology: true,
		}
	);

	return client;
};



module.exports = { connectDatabase };
