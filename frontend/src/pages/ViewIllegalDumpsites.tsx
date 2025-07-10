import { useEffect, useState } from 'react';
import './ViewIllegalDumpsites.css';

interface Report {
  report_id: number;
  user_name: string;
  report_location: string;
  report_description: string;
  created_at?: string;
}

function ViewIllegalDumpsites() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error('Error fetching reports:', err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="dumpsite-view">
      <h2>🧾 Reported Illegal Dumpsites</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="report-list">
          {reports.map(report => (
            <div key={report.report_id} className="report-card">
              <p><strong>Reported by:</strong> {report.user_name}</p>
              <p><strong>Location:</strong> {report.report_location}</p>
              <p><strong>Description:</strong> {report.report_description}</p>
              <p><strong>Reported At:</strong> {new Date(report.created_at || '').toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewIllegalDumpsites;
