const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const testRoutes = require('./routes/test');
const adminRoutes = require('./routes/admin');
const interviewRoutes = require('./routes/interview');
const compilerRoutes = require('./routes/compiler');
const seedJobs = require('./data/sampleJobs');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/compiler', compilerRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('<h2>Antigravity API server is running successfully!</h2><p>This is the backend server. Please run and access the <b>client</b> app to view the user interface.</p>');
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed default admin account
async function seedAdmin() {
    try {
        const existing = await User.findOne({ email: 'admin@recruit.com', role: 'admin' });
        if (!existing) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                email: 'admin@recruit.com',
                password: hashedPassword,
                role: 'admin',
                name: 'Admin',
                profileCompleted: true,
            });
            console.log('👤 Default admin created (admin@recruit.com / admin123)');
        }
    } catch (err) {
        console.error('Admin seed error:', err.message);
    }
}

async function connectWithFallback() {
    const primaryUri = process.env.MONGO_DB_URL;
    const fallbackUri = process.env.MONGO_DB_FALLBACK_URL;

    if (!primaryUri) {
        throw new Error('MONGO_DB_URL is not set in the environment.');
    }

    try {
        await mongoose.connect(primaryUri);
        return;
    } catch (err) {
        const isSrvDnsFailure =
            typeof primaryUri === 'string' &&
            primaryUri.startsWith('mongodb+srv://') &&
            /querySrv|ENOTFOUND|ECONNREFUSED/i.test(err.message || '');

        if (!isSrvDnsFailure || !fallbackUri) {
            throw err;
        }

        console.warn('⚠️ SRV DNS lookup failed. Retrying with MONGO_DB_FALLBACK_URL...');
        await mongoose.connect(fallbackUri);
    }
}

async function startServer() {
    try {
        await connectWithFallback();
        console.log('✅ MongoDB connected');
        await seedJobs();
        await seedAdmin();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error(
            'Tip: if your network blocks DNS SRV lookups, set MONGO_DB_FALLBACK_URL to Atlas standard (non-SRV) URI.'
        );
        process.exit(1);
    }
}

startServer();
