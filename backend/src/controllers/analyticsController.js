const pool = require('../config/db');

// 1. Get Total Waste Sorted by Category
const getWasteSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        SUM(plastic_weight) AS total_plastic,
        SUM(organic_weight) AS total_organic,
        SUM(hazardous_weight) AS total_hazardous
      FROM systemwastesortingrecords;
    `);

    res.status(200).json({
      message: 'Waste summary fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching waste summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Get Total Reward Points by All Users
const getRewardsSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_users,
        SUM(reward_points) AS total_points_distributed
      FROM systemrewards;
    `);

    res.status(200).json({
      message: 'Rewards summary fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching rewards summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get Top Users Based on Reward Points
const getTopUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        su.user_id, su.user_name, su.user_email, sr.reward_points, sr.reward_badge
      FROM systemrewards sr
      JOIN systemusers su ON sr.user_id = su.user_id
      ORDER BY sr.reward_points DESC
      LIMIT 10;
    `);

    res.status(200).json({
      message: 'Top users fetched successfully',
      users: result.rows
    });
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAdminStats = async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM systemusers');
    const pickups = await pool.query("SELECT COUNT(*) FROM systempickuprequests WHERE status = 'completed'");
    const badges = await pool.query("SELECT COUNT(*) FROM systemrewards WHERE reward_badge IS NOT NULL");
    const reports = await pool.query("SELECT COUNT(*) FROM systemillegaldumpsitesreports");

    res.status(200).json({
      total_users: parseInt(users.rows[0].count),
      total_pickups: parseInt(pickups.rows[0].count),
      total_badges: parseInt(badges.rows[0].count),
      total_reports: parseInt(reports.rows[0].count)
    });
  } catch (error) {
  console.error('❌ Admin stats error:', error); // <== Add this
  res.status(500).json({ error: 'Failed to fetch stats' });
}

};


module.exports = {
  getWasteSummary,
  getRewardsSummary,
  getTopUsers,
  getAdminStats // ✅ include this
};
