// src/pages/ViewIllegalDumpsites.tsx
import { useEffect, useState } from 'react';
import './ViewIllegalDumpsites.css';

interface Report {
  report_id: number;
  report_location: string;
  report_description: string;
  reported_at: string;
  is_resolved: boolean;
  reporter_name?: string;
}

function ViewIllegalDumpsites() {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setReports(data.reports);
      else console.error(data.message || data.error);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleResolve = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/reports/resolve/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Report marked as resolved.');
        fetchReports(); // Refresh
      } else {
        alert(`❌ ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('Error resolving report:', err);
      alert('❌ Failed to mark as resolved');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="view-dumpsites-container">
      <h1>🛑 Illegal Dumpsite Reports</h1>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        reports.map((report) => (
          <div key={report.report_id} className="report-card">
            <p><strong>Location:</strong> {report.report_location}</p>
            <p><strong>Description:</strong> {report.report_description}</p>
            <p><strong>Reported by:</strong> {report.reporter_name || 'Unknown'}</p>
            <p><strong>Date:</strong> {new Date(report.reported_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {report.is_resolved ? '✅ Resolved' : '❌ Unresolved'}</p>

            {!report.is_resolved && (
              <button className="resolve-btn" onClick={() => handleResolve(report.report_id)}>
                ✔️ Mark as Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ViewIllegalDumpsites;
