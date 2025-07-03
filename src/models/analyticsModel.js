const pool = require('../config/db');

// Total waste sorted by user
const getWasteStatsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT 
      SUM(plastic_weight) AS total_plastic,
      SUM(organic_weight) AS total_organic,
      SUM(hazardous_weight) AS total_hazardous
     FROM systemwastesortingrecords
     WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

// Get reward stats
const getRewardStats = async (user_id) => {
  const result = await pool.query(
    'SELECT reward_points, reward_badge FROM systemrewards WHERE user_id = $1',
    [user_id]
  );
  return result.rows[0];
};

module.exports = {
  getWasteStatsByUser,
  getRewardStats,
};
