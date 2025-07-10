import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import './ResolvedUnresolvedCases.css';

interface Report {
  report_id: number;
  report_location: string;
  report_description: string;
  reported_at: string;
  is_resolved: boolean;
  reporter_name?: string;
}

function ResolvedUnresolvedCases() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setReports(data.reports);
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const markAsResolved = async (report_id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/reports/resolve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ report_id }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchReports(); // reload updated data
      } else {
        alert(data.message || 'Failed to mark as resolved');
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  const generateReport = async () => {
    const paragraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: "Illegal Dumpsite Report Summary",
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph(" "),
      ...reports.map((r, i) =>
        new Paragraph(
          `${i + 1}. Location: ${r.report_location}, Status: ${r.is_resolved ? 'Resolved' : 'Unresolved'}, Description: ${r.report_description}`
        )
      ),
    ];

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Dumpsite_Report_Summary.docx");
  };

  const resolved = reports.filter(r => r.is_resolved);
  const unresolved = reports.filter(r => !r.is_resolved);

  return (
    <div className="municipal-reports-page">
      {/* Top Bar */}
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/municipal')}>Home</button>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
        </div>
      </header>

      {/* Page Content */}
      <main className="reports-container">
        <h1>Resolved & Unresolved Dumpsite Reports</h1>

        <section className="reports-section">
          <h2>🚨 Unresolved Reports</h2>
          {unresolved.length === 0 ? (
            <p>No unresolved reports.</p>
          ) : (
            <div className="reports-grid">
              {unresolved.map((r) => (
                <div className="report-card" key={r.report_id}>
                  <p><strong>Location:</strong> {r.report_location}</p>
                  <p><strong>Description:</strong> {r.report_description}</p>
                  <p><strong>Date:</strong> {new Date(r.reported_at).toLocaleDateString()}</p>
                  <button onClick={() => markAsResolved(r.report_id)}>✔️ Mark as Resolved</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="reports-section">
          <h2>✅ Resolved Reports</h2>
          {resolved.length === 0 ? (
            <p>No resolved reports yet.</p>
          ) : (
            <div className="reports-grid">
              {resolved.map((r) => (
                <div className="report-card" key={r.report_id}>
                  <p><strong>Location:</strong> {r.report_location}</p>
                  <p><strong>Description:</strong> {r.report_description}</p>
                  <p><strong>Date:</strong> {new Date(r.reported_at).toLocaleDateString()}</p>
                  <p className="status-label">✅ Already Resolved</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {reports.length > 0 && (
          <div className="report-footer">
            <button className="generate-report-btn" onClick={generateReport}>
              📄 Generate Word Report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ResolvedUnresolvedCases;
