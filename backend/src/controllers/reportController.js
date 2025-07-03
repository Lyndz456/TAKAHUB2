const pool = require('../config/db');

// Submit illegal dumpsite report
const reportIllegalDumpsite = async (req, res) => {
  try {
    const { user_id, report_location, report_description, anonymous } = req.body;

    const result = await pool.query(
      `INSERT INTO systemillegaldumpsitesreports (user_id, report_location, report_description, anonymous)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, report_location, report_description, anonymous]
    );

    res.status(201).json({ message: 'Illegal dumpsite reported successfully', report: result.rows[0] });
  } catch (error) {
    console.error('Error reporting dumpsite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  reportIllegalDumpsite,
};
