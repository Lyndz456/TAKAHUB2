import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResidentDashboard from './pages/ResidentDashboard';
import SortingGuide from './pages/SortingGuide';
import BookPickup from './pages/BookPickup';
import CollectorDashboard from './pages/CollectorDashboard';
import PickupRequests from "./pages/PickupRequests";
import AdminPanel from './pages/AdminPanel';
import MunicipalView from './pages/MunicipalView';
import ReportDumpsite from "./pages/ReportDumpsite";
import RewardsPage from "./pages/RewardsPage";
import ResolvedUnresolvedCases from "./pages/ResolvedUnresolvedCases";
import ManageUsers from "./pages/MangeUsers";
import RewardLogs from './pages/RewardLogs';
import ViewIllegalDumpsites from './pages/ViewIllegalDumpsites';
import CollectionHistory from "./pages/CollectionHistory";
import MyReports from './pages/MyReports';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/resident" element={<ResidentDashboard />} />
      <Route path="/sorting-guide" element={<SortingGuide />} />
      <Route path="/collector/pickup-requests" element={<PickupRequests />} />
      <Route path="/book-pickup" element={<BookPickup />} />
      <Route path="/municipal/resolved-unresolved-cases" element={<ResolvedUnresolvedCases />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/rewards" element={<RewardLogs />} />
      <Route path="/rewards-page" element={<RewardsPage />} />
      <Route path="/report-dumpsite" element={<ReportDumpsite />} />
      <Route path="/admin/view-dumpsites" element={<ViewIllegalDumpsites />} />
      <Route path="/municipal/view-dumpsites" element={<ViewIllegalDumpsites />} /> {/* ✅ NEW */}
      <Route path="/collector" element={<CollectorDashboard />} />
      <Route path="/collection-history" element={<CollectionHistory />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/municipal" element={<MunicipalView />} />
      <Route path="/resident/my-reports" element={<MyReports />} />
    </Routes>
  );
}

export default App;
