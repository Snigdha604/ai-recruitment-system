const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const Application = require('../server/models/Application');
const Job = require('../server/models/Job');

async function checkApps() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Connected to DB');
        
        const apps = await Application.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent Applications:');
        apps.forEach(app => {
            console.log(`ID: ${app._id}, Stage: ${app.currentStage}, Coding Questions Count: ${app.codingQuestions.length}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkApps();
