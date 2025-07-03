const db = require('../config/db');

// Create or update a reward entry
const upsertUserReward = async (user_id, points, badge = null) => {
  const existing = await db.query(
    'SELECT * FROM systemrewards WHERE user_id = $1',
    [user_id]
  );

  if (existing.rows.length > 0) {
    // Update reward
    const updated = await db.query(
      `UPDATE systemrewards 
       SET reward_points = reward_points + $1, reward_badge = $2, last_updated = CURRENT_TIMESTAMP 
       WHERE user_id = $3 
       RETURNING *`,
      [points, badge, user_id]
    );
    return updated.rows[0];
  } else {
    // Create new reward entry
    const created = await db.query(
      `INSERT INTO systemrewards (user_id, reward_points, reward_badge) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user_id, points, badge]
    );
    return created.rows[0];
  }
};

// Fetch all rewards
const getAllRewards = async () => {
  const result = await db.query(`
    SELECT 
      r.reward_id, r.user_id, u.user_name, r.reward_points, r.reward_badge, r.last_updated
    FROM 
      systemrewards r
    JOIN 
      systemusers u ON r.user_id = u.user_id
    ORDER BY 
      r.reward_points DESC
  `);
  return result.rows;
};

module.exports = {
  upsertUserReward,
  getAllRewards
};
