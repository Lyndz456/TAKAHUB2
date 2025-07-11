const pool = require('../config/db');

// Fetch rewards for the currently logged-in user
const getUserRewards = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT user_id, reward_points, reward_badge, last_updated
       FROM systemrewards
       WHERE user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No rewards found for this user' });
    }

    // ✅ Cleaned response with only necessary fields
    res.status(200).json({
      reward_points: result.rows[0].reward_points,
      reward_badge: result.rows[0].reward_badge,
      last_updated: result.rows[0].last_updated
    });

  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Admin: Get all residents' reward logs
const getAllRewardLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.user_id,
        u.user_name,
        u.user_email,
        r.reward_points,
        r.reward_badge,
        (
          SELECT COUNT(*) 
          FROM systempickuprequests p 
          WHERE p.user_id = u.user_id AND p.status = 'completed'
        ) AS total_pickups
      FROM systemrewards r
      JOIN systemusers u ON r.user_id = u.user_id
      WHERE u.role = 'resident'
      ORDER BY r.reward_points DESC
    `);

    res.status(200).json({ logs: result.rows });
  } catch (error) {
    console.error('Error fetching reward logs:', error);
    res.status(500).json({ message: 'Failed to fetch reward logs' });
  }
};

module.exports = {
  getUserRewards,
  getAllRewardLogs // ✅ export it here
};
