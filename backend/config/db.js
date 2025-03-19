const mongoose = require('mongoose');
const connectDB = async () => {

    dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
});
    
};
module.exports = connectDB;
