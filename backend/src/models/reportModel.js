const pool = require('../config/db');

// Add a new illegal dumpsite report
const addIllegalDumpsiteReport = async (user_id, report_location, report_description, anonymous) => {
  const result = await pool.query(
    `INSERT INTO systemillegaldumpsitesreports (
      user_id, report_location, report_description, anonymous
    ) VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, report_location, report_description, anonymous]
  );
  return result.rows[0];
};

// Get all reports
const getAllReports = async () => {
  const result = await pool.query(
    `SELECT * FROM systemillegaldumpsitesreports ORDER BY report_id DESC`
  );
  return result.rows;
};

// Get reports submitted by a specific user
const getReportsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM systemillegaldumpsitesreports WHERE user_id = $1 ORDER BY report_id DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = {
  addIllegalDumpsiteReport,
  getAllReports,
  getReportsByUser
};
