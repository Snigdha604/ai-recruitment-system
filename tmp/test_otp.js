const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });
const Otp = require('./server/models/Otp');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Connected to DB');
        const email = 'test@example.com';
        const otp = '123456';
        
        await Otp.deleteMany({ email: email.toLowerCase() });
        console.log('Deleted old OTPs');
        
        await Otp.create({ email: email.toLowerCase(), otp });
        console.log('Created new OTP');
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

test();
