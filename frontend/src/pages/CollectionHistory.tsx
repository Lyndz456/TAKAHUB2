import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../pages/CollectionHistory.css";

interface CollectionItem {
  id: string;
  date: string;
  location: string;
  plasticKg: number;
  paperKg: number;
  glassKg: number;
  metalKg: number;
  totalKg: number;
}

const CollectionHistory: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  useEffect(() => {
    console.log("Collection History Page Loaded");

    // ✅ TEMPORARY DUMMY DATA FOR TESTING UI
    const dummyData: CollectionItem[] = [
      {
        id: "001",
        date: "2025-07-01T10:00:00.000Z",
        location: "Nairobi West",
        plasticKg: 3,
        paperKg: 2,
        glassKg: 1,
        metalKg: 1,
        totalKg: 7
      },
      {
        id: "002",
        date: "2025-07-03T14:30:00.000Z",
        location: "Kasarani",
        plasticKg: 5,
        paperKg: 1,
        glassKg: 2,
        metalKg: 0,
        totalKg: 8
      }
    ];

    setCollections(dummyData);

    // ✅ LATER REPLACE THIS WITH YOUR BACKEND FETCH
    /*
    const fetchCollections = async () => {
      try {
        const response = await fetch(`/api/collector/collections?collectorId=${user.id}`);
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collection history", error);
      }
    };

    if (user?.id) {
      fetchCollections();
    }
    */
  }, []);

  const totalCollections = collections.length;
  const totalKg = collections.reduce((sum, item) => sum + item.totalKg, 0);

  return (
    <div className="collector-history-container">
      {/* ✅ Top Bar (Green) */}
      <div className="topbar">
        <button
          onClick={() => navigate("/collector")}
          className="topbar-button"
        >
          Home
        </button>
        <button onClick={logout} className="topbar-button logout">
          Logout
        </button>
      </div>

      <h2 className="page-title">My Collection History</h2>

      <div className="summary-box">
        <p>Total Collections: {totalCollections}</p>
        <p>Total Kilograms Collected: {totalKg} kg</p>
      </div>

      <div className="collections-list">
        {collections.map((item) => (
          <div className="collection-card" key={item.id}>
            <p>
              <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {item.location}
            </p>
            <p>
              <strong>Total:</strong> {item.totalKg} kg
            </p>
            <div className="breakdown">
              <p>Plastic: {item.plasticKg} kg</p>
              <p>Paper: {item.paperKg} kg</p>
              <p>Glass: {item.glassKg} kg</p>
              <p>Metal: {item.metalKg} kg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionHistory;
