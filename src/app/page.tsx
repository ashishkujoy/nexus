
// import { AlertTriangle, Calendar, FileText } from "lucide-react";
import { getServerSession } from "next-auth";
import { fetchBatchesAssigned } from "./action";
import BatchSection from "./BatchSection";
import AppHeader from "./components/AppHeader";
import { authOptions, User } from "./lib/auth";


// const recentActivity = [
//   { type: 'observation', intern: 'John Doe', action: 'Recorded observation', time: '2 hours ago', critical: false },
//   { type: 'feedback', intern: 'Jane Smith', action: 'Delivered feedback', time: '5 hours ago', critical: false },
//   { type: 'notice', intern: 'Mike Wilson', action: 'Notice period issued', time: '1 day ago', critical: true },
//   { type: 'observation', intern: 'Alice Brown', action: 'Critical observation recorded', time: '2 days ago', critical: true }
// ];

// const RecentActivities = () => {
//   return (
//     <div className="activity-card">
//       <div className="activity-header">
//         <h3>Recent Activity</h3>
//       </div>
//       <EmptyRecentActivitySection />
//       {/* Uncomment the below code to display recent activities */}
//       {/* <div>
//         {recentActivity.map((activity, index) => (
//           <div key={index} className="activity-item">
//             <div className={`activity-icon ${activity.critical ? 'critical' : ''}`}>
//               {activity.type === 'observation' && <FileText className="icon-sm" />}
//               {activity.type === 'feedback' && <Calendar className="icon-sm" />}
//               {activity.type === 'notice' && <AlertTriangle className="icon-sm" />}
//             </div>
//             <div className="activity-content">
//               <p className="activity-name">{activity.intern}</p>
//               <p className="activity-action">{activity.action}</p>
//             </div>
//             <div className="activity-time">
//               {activity.time}
//             </div>
//           </div>
//         ))}
//       </div> */}
//     </div>
//   )
// }

// const EmptyRecentActivitySection = () => {
//   return (
//     <div className="empty-state">
//       <div className="empty-icon">📊</div>
//       <div className="empty-title">No recent activity</div>
//       <div className="empty-description">
//         Your recent activities, feedback, and observations will be displayed here once you start using the platform.
//       </div>
//     </div>
//   )
// }


const MainContent = async (props: { user: User }) => {
  const batchs = await fetchBatchesAssigned(props.user.id, props.user.isRoot);

  return (
    <main className="content">
      <BatchSection batchs={batchs} allowBatchCreation={props.user.isRoot}/>
      {/* <RecentActivities /> */}
    </main>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) return <></>;

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="main-content">
          <AppHeader />
          <MainContent user={user} />
        </div>
      </div>
    </div>
  );
}
