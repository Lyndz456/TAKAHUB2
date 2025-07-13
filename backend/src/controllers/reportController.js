const pool = require('../config/db');

// 1. Submit illegal dumpsite report (no image)
const reportIllegalDumpsite = async (req, res) => {
  try {
    const { report_location, report_description } = req.body;
    const user_id = req.user.user_id;

    const result = await pool.query(
      `INSERT INTO systemillegaldumpsitesreports (user_id, report_location, report_description)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, report_location, report_description]
    );

    res.status(201).json({
      message: 'Illegal dumpsite reported successfully',
      report: result.rows[0],
    });
  } catch (error) {
    console.error('Error reporting dumpsite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Get all reports (for municipal view)
const getAllDumpsiteReports = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.user_name AS reporter_name
       FROM systemillegaldumpsitesreports r
       JOIN systemusers u ON r.user_id = u.user_id
       ORDER BY reported_at DESC`
    );

    res.status(200).json({ reports: result.rows });
  } catch (error) {
    console.error('Error fetching all dumpsite reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// 3. Get reports by logged-in resident
const getResidentDumpsiteReports = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await pool.query(
      `SELECT * FROM systemillegaldumpsitesreports
       WHERE user_id = $1
       ORDER BY reported_at DESC`,
      [user_id]
    );

    res.status(200).json({ reports: result.rows });
  } catch (error) {
    console.error('Error fetching resident dumpsite reports:', error);
    res.status(500).json({ error: 'Failed to fetch your reports' });
  }
};


// 4. Mark report as resolved
const markDumpsiteResolved = async (req, res) => {
  try {
    const { report_id } = req.body;

    const result = await pool.query(
      `UPDATE systemillegaldumpsitesreports
       SET is_resolved = true
       WHERE report_id = $1
       RETURNING *`,
      [report_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report marked as resolved', report: result.rows[0] });
  } catch (error) {
    console.error('Error marking report resolved:', error);
    res.status(500).json({ error: 'Failed to resolve report' });
  }
};

// 5. Get stats (for municipal dashboard)
const getDumpsiteStats = async (req, res) => {
  try {
    const totalResult = await pool.query(
      'SELECT COUNT(*) FROM systemillegaldumpsitesreports'
    );
    const unresolvedResult = await pool.query(
      'SELECT COUNT(*) FROM systemillegaldumpsitesreports WHERE is_resolved = false'
    );

    res.status(200).json({
      total: parseInt(totalResult.rows[0].count, 10),
      unresolved: parseInt(unresolvedResult.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Error fetching dumpsite stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = {
  reportIllegalDumpsite,
  getAllDumpsiteReports,
  getResidentDumpsiteReports,
  markDumpsiteResolved,
  getDumpsiteStats,
};
