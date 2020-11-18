const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB, {useNewUrlParser: true});

const db = async () => {
    let uri = process.env.MONGODB;

    const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log(`Mongoose connected : ${conn.connection.host}`);
};

module.exports = db;
