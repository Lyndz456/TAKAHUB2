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

module.exports = {
  getUserRewards
};
