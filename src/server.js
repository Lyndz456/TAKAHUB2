const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const reportRoutes = require('./routes/reportRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const pool = require('./config/db');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
