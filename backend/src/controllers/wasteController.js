const pool = require('../config/db');

// ✅ Submit waste sorting record and calculate rewards
const submitWasteSorting = async (req, res) => {
  const {
    date_sorted,
    plastic_weight,
    organic_weight,
    hazardous_weight,
    notes,
    user_id,           // passed from frontend
    request_id         // for marking pickup completed
  } = req.body;

  try {
    // 1. Insert waste sorting record
    const result = await pool.query(
      `INSERT INTO systemwastesortingrecords (
        user_id, date_sorted, plastic_weight, organic_weight, hazardous_weight, notes
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, date_sorted, plastic_weight, organic_weight, hazardous_weight, notes]
    );

    // 2. Calculate reward points
    const totalWeight = (plastic_weight || 0) + (organic_weight || 0) + (hazardous_weight || 0);
    const rewardPoints = totalWeight * 2;

    // 3. Fetch or insert reward
    const existingReward = await pool.query(
      'SELECT * FROM systemrewards WHERE user_id = $1',
      [user_id]
    );

    let newTotal = rewardPoints;
    let badge = '';

    const getBadge = (points) => {
      if (points >= 100) return 'Gold';
      if (points >= 50) return 'Silver';
      if (points >= 20) return 'Bronze';
      return null;
    };

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

    // 4. Mark pickup as completed
    if (request_id) {
      await pool.query(
        'UPDATE systempickuprequests SET status = $1 WHERE request_id = $2',
        ['completed', request_id]
      );
    }

    res.status(201).json({
      message: 'Waste recorded and rewards updated.',
      record: result.rows[0],
      reward_points_earned: rewardPoints,
      total_points: newTotal,
      badge_awarded: badge
    });

  } catch (error) {
    console.error('Error in waste sorting submission:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get reward stats for resident
const getRewardStats = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const rewardRes = await pool.query(
      'SELECT reward_points, reward_badge FROM systemrewards WHERE user_id = $1',
      [user_id]
    );

    const wasteRes = await pool.query(
      `SELECT 
         COALESCE(SUM(plastic_weight + organic_weight + hazardous_weight), 0) AS total_weight
       FROM systemwastesortingrecords
       WHERE user_id = $1`,
      [user_id]
    );

    // ✅ Add pickup count (status = 'completed')
    const pickupRes = await pool.query(
      'SELECT COUNT(*) FROM systempickuprequests WHERE user_id = $1 AND status = $2',
      [user_id, 'completed']
    );


    res.status(200).json({
      reward_points: rewardRes.rows[0]?.reward_points || 0,
      reward_badge: rewardRes.rows[0]?.reward_badge || null,
      total_weight: wasteRes.rows[0].total_weight || 0,
      total_pickups: Number(pickupRes.rows[0].count) || 0  // ✅ include this
    });

  } catch (error) {
    console.error('Error fetching reward stats:', error);
    res.status(500).json({ error: 'Failed to load reward stats' });
  }
};

module.exports = {
  submitWasteSorting,
  getRewardStats // ✅ Export it here
};
