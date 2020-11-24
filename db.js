const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB, {useNewUrlParser: true});

const connectDB = async () => {
    let uri = process.env.MONGODB;

    const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false, //index의 logout에서findOneAndUpdate 이게 오래 되었다고 나옴
    });
    console.log(`Mongoose connected : ${conn.connection.host}`);
};

module.exports = connectDB;
