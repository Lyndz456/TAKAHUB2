import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import './ResolvedUnresolvedCases.css';

function ResolvedUnresolvedCases() {
  const navigate = useNavigate();

  // ✅ Simulate report data
  const [reports, setReports] = useState([
    { id: 1, location: "Kasarani", status: "resolved", type: "Plastic" },
    { id: 2, location: "Westlands", status: "unresolved", type: "Metal" },
    { id: 3, location: "South B", status: "unresolved", type: "Paper" },
  ]);

  // ✅ Mark report as resolved locally
  const markAsResolved = (id: number) => {
    const updatedReports = reports.map((report) =>
      report.id === id ? { ...report, status: "resolved" } : report
    );
    setReports(updatedReports);
  };

  const generateReport = async () => {
    const paragraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: "Waste Analysis Report",
            bold: true,
            size: 32,
          }),
        ],
      }),
      new Paragraph(""),
      ...reports.map((report, index) =>
        new Paragraph(
          `${index + 1}. Location: ${report.location}, Status: ${report.status}, Type: ${report.type}`
        )
      ),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Waste_Analysis_Report.docx");
  };

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

      {/* Body */}
      <main className="reports-container">
        <h1>Resolved & Unresolved Cases</h1>

        <div className="reports-grid">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="report-card">
                <h3>
                  {report.status === "resolved"
                    ? "✅ Resolved Dumpsite Case"
                    : "🚨 Unresolved Dumpsite Case"}
                </h3>
                <p><strong>Location:</strong> {report.location}</p>
                <p><strong>Type:</strong> {report.type}</p>
                <p><strong>Status:</strong> {report.status}</p>

                {report.status !== "resolved" && (
                  <button
                    className="resolve-btn"
                    onClick={() => markAsResolved(report.id)}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No reports available.</p>
          )}
        </div>

        {reports.length > 0 && (
          <div className="report-footer visible">
            <button className="generate-report-btn" onClick={generateReport}>
              📊 Generate Waste Analysis Report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ResolvedUnresolvedCases;
