const mongoose = require('mongoose')

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_LOCAL)
    } catch (error) {
        console.log(error);
        process.off(1)
    }
}