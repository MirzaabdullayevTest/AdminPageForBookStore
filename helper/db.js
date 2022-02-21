const mongoose = require('mongoose')
let uri = null;

if (!process.env.MONGO_URI_LOCAL) {
    uri = process.env.MONGO_URI
} else {
    uri = process.env.MONGO_URI_LOCAL
}

module.exports = async () => {
    try {
        await mongoose.connect(uri, ()=>{
            console.log('MongoDB connected');
        })
    } catch (error) {
        console.log(error);
        process.off(1)
    }
}