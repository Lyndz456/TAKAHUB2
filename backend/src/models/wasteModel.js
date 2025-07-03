const db = require('../config/db');

// Save a new waste sorting record
const createWasteSortingRecord = async (user_id, date_sorted, plastic, organic, hazardous, notes) => {
  const result = await db.query(
    `INSERT INTO systemwastesortingrecords (
      user_id, date_sorted, plastic_weight, organic_weight, hazardous_weight, notes
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user_id, date_sorted, plastic, organic, hazardous, notes]
  );
  return result.rows[0];
};

// Get all sorting records for a specific user
const getUserSortingRecords = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM systemwastesortingrecords 
     WHERE user_id = $1 
     ORDER BY recorded_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Get all sorting records (admin/analytics)
const getAllSortingRecords = async () => {
  const result = await db.query(
    `SELECT r.*, u.user_name 
     FROM systemwastesortingrecords r
     JOIN systemusers u ON r.user_id = u.user_id
     ORDER BY recorded_at DESC`
  );
  return result.rows;
};

module.exports = {
  createWasteSortingRecord,
  getUserSortingRecords,
  getAllSortingRecords
};
