
import { AlertTriangle, Calendar, Plus } from "lucide-react";
import { ReactNode } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


const getPermissionBadges = (permissions: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badgeMap: any = {
    recordObservation: { text: 'Observe', color: 'badge-blue' },
    recordFeedback: { text: 'Feedback', color: 'badge-green' },
    deliverFeedback: { text: 'Deliver', color: 'badge-purple' },
    programManager: { text: 'PM', color: 'badge-red' }
  };

  return permissions.map(perm => badgeMap[perm]).filter(Boolean);
};

const Batchs = () => {
  const batches = [
    {
      id: 1,
      name: "STEP 2024 Batch A",
      startDate: "2024-01-15",
      internCount: 35,
      pendingObservations: 5,
      pendingFeedback: 8,
      noticesActive: 2,
      permissions: ['recordObservation', 'recordFeedback', 'deliverFeedback'],
      isAdmin: false
    },
    {
      id: 2,
      name: "STEP 2024 Batch B",
      startDate: "2024-06-01",
      internCount: 28,
      pendingObservations: 3,
      pendingFeedback: 12,
      noticesActive: 0,
      permissions: ['recordObservation', 'programManager'],
      isAdmin: true
    }
  ];

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">My Batches</h3>
        <button className="add-btn">
          <Plus className="icon-sm" />
          <span className="add-btn-text">Add Batch</span>
        </button>
      </div>

      <div className="batch-grid">
        {batches.map((batch) => (
          <div key={batch.id} className="batch-card">
            <div className="batch-header">
              <div className="batch-info">
                <h4>{batch.name}</h4>
                <p>Started: {new Date(batch.startDate).toLocaleDateString()}</p>
              </div>
              {batch.isAdmin && (
                <span className="admin-badge">
                  Admin
                </span>
              )}
            </div>

            <div className="batch-stats">
              <div className="batch-stat">
                <p className="batch-stat-number">{batch.internCount}</p>
                <p className="batch-stat-label">Interns</p>
              </div>
              <div className="batch-stat">
                <p className="batch-stat-number red">{batch.noticesActive}</p>
                <p className="batch-stat-label">Notices</p>
              </div>
            </div>

            <div className="permission-badges">
              {getPermissionBadges(batch.permissions).map((badge, index) => (
                <span key={index} className={`badge ${badge.color}`}>
                  {badge.text}
                </span>
              ))}
            </div>

            <div className="batch-footer">
              <span>Pending Obs: {batch.pendingObservations}</span>
              <span>Pending FB: {batch.pendingFeedback}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const StatCard = (props: { icon: ReactNode; title: string; value: number }) => {
  return (
    <div className="stat-card">
      <div className="stat-content">
        {props.icon}
        <div className="stat-info">
          <h3>{props.title}</h3>
          <p>{props.value}</p>
        </div>
      </div>
    </div>
  )
}

const QuickStats = () => {
  return (
    <div className="stats-grid">
      <StatCard icon={<Calendar className="stat-icon purple" />} title="Pending Observations" value={8} />
      <StatCard icon={<AlertTriangle className="stat-icon red" />} title="Active Notices" value={2} />
    </div>
  )
}

const MainContent = () => {
  return (
    <main className="content">
      <QuickStats />
      <Batchs />

    </main>
  )
}

export default function Home() {
  return (
    <div className="main-container">
      <div className="page-container">
        <Sidebar currentUser={{ name: "Martha", email: "martha@gmail.com" }} />
        <div className="main-content">
          <Header />
          <MainContent />
        </div>
      </div>
    </div>
  );
}
