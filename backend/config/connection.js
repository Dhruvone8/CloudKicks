const mongoose = require("mongoose");
const config = require("config")

mongoose
    .connect(`${config.get("MONGODB_URI")}/cloudKicks`)
    .then(() => {
        console.log("MongoDB Connection Established!!✅")
    })
    .catch((err) => {
        console.log(err)
    })

module.exports = mongoose.connection;