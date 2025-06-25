
import { AlertTriangle, Calendar } from "lucide-react";
import { ReactNode } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

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
