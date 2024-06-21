const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://dhruvin019:Dhruvin019@cluster0.vc73ww8.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected');
    } catch (error) {
        console.log(`MONGO Connect ERROR: ${error.message}`);
    }
};

module.exports = connectDB;
