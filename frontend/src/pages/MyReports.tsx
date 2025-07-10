import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyReports.css';

interface Report {
  report_id: number;
  report_location: string;
  report_description: string;
  reported_at: string;
  is_resolved: boolean;
}

function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/reports/my-reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setReports(data.reports);
        else console.error(data.message);
      } catch (err) {
        console.error('Failed to load reports:', err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="my-reports-page">
      <header className="topbar">
        <h2>📝 My Illegal Dumpsite Reports</h2>
        <button onClick={() => navigate('/resident')}>⬅ Back</button>
      </header>

      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <div className="report-list">
          {reports.map(report => (
            <div key={report.report_id} className="report-card">
              <p><strong>Location:</strong> {report.report_location}</p>
              <p><strong>Description:</strong> {report.report_description}</p>
              <p><strong>Date:</strong> {new Date(report.reported_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {report.is_resolved ? '✅ Resolved' : '❌ Unresolved'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReports;
