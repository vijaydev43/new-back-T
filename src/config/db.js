const mongoose =require('mongoose')
const config = require('./config')
const db = new Object()

db.establishConnection = async () => {
	const dbUrl = config?.dataBase?.url;
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
	const connect = () => {
		mongoose.connect(dbUrl)
			.then(() => {
				return console.log(`Successfully connected to mongodb`);
			})
			.catch(error => {
				console.log("Error connecting to database: ", error);
				return process.exit(1);
			});
	};
	connect();
	mongoose.connection.on("disconnected", connect);
};
module.exports = db;
