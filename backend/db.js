import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://Dulguunzaya:Dukduk019216@cluster0.4emxqun.mongodb.net/?appName=Cluster0";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        throw err;
    }
};

export default connectDB;
 