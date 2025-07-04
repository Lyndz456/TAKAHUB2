const pool = require('../config/db');

// Submit illegal dumpsite report
const reportIllegalDumpsite = async (req, res) => {
  try {
    const { report_location, report_description, image_url } = req.body;
    const user_id = req.user.user_id; // ✅ From verified JWT token

    const result = await pool.query(
      `INSERT INTO systemillegaldumpsitesreports (user_id, report_location, report_description, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, report_location, report_description,image_url]
    );

    res.status(201).json({
      message: 'Illegal dumpsite reported successfully',
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error reporting dumpsite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  reportIllegalDumpsite
};
