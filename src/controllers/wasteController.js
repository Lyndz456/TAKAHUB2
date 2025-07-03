const pool = require('../config/db');

// Updated controller to handle rewards
const submitWasteSorting = async (req, res) => {
  const {
    user_id,
    date_sorted,
    plastic_weight,
    organic_weight,
    hazardous_weight,
    notes
  } = req.body;

  try {
    // 1. Insert the waste sorting record
    const result = await pool.query(
      `INSERT INTO systemwastesortingrecords (
        user_id, date_sorted, plastic_weight, organic_weight, hazardous_weight, notes
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, date_sorted, plastic_weight, organic_weight, hazardous_weight, notes]
    );

    // 2. Calculate reward points (2 points per kg)
    const totalWeight = (plastic_weight || 0) + (organic_weight || 0) + (hazardous_weight || 0);
    const rewardPoints = totalWeight * 2;

    // 3. Fetch existing reward
    const existingReward = await pool.query(
      'SELECT * FROM systemrewards WHERE user_id = $1',
      [user_id]
    );

    let newTotal = rewardPoints;
    let badge = '';

    // 4. Badge assignment logic
    const getBadge = (points) => {
      if (points >= 100) return 'Gold';
      if (points >= 50) return 'Silver';
      if (points >= 20) return 'Bronze';
      return null;
    };

    // 5. Update or insert reward
    if (existingReward.rows.length > 0) {
      const currentPoints = existingReward.rows[0].reward_points;
      newTotal = currentPoints + rewardPoints;
      badge = getBadge(newTotal);

      await pool.query(
        `UPDATE systemrewards 
         SET reward_points = $1, reward_badge = $2, last_updated = CURRENT_TIMESTAMP 
         WHERE user_id = $3`,
        [newTotal, badge, user_id]
      );
    } else {
      badge = getBadge(newTotal);
      await pool.query(
        `INSERT INTO systemrewards (user_id, reward_points, reward_badge) 
         VALUES ($1, $2, $3)`,
        [user_id, newTotal, badge]
      );
    }

    // 6. Respond
    res.status(201).json({
      message: 'Waste sorted successfully and reward updated',
      record: result.rows[0],
      reward_points_earned: rewardPoints,
      total_points: newTotal,
      badge_awarded: badge
    });
  } catch (error) {
    console.error('Error submitting waste sorting record:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  submitWasteSorting
};
