import AppHeader from "@/app/components/AppHeader";
import Feedbacks from "@/app/components/Feedbacks";
import { FeedbackIcon, NoticeIcon, ObservationIcon } from "@/app/components/Icons";
import Observations from "@/app/components/Observations";
import { authOptions } from "@/app/lib/auth";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/app/components/Skeleton";
import { Intern } from "../../page";
import { Feedback, Observation, Permissions } from "../../types";
import { fetchBatchName, fetchFeedbacks, fetchIntern, fetchObservations, fetchPermissions } from "./action";
import "./page.css";
import QuickActions from "./QuickAction";

type ProfileInfoProps = {
    name: string;
    email: string;
    terminated: boolean;
    notice: boolean;
}

const ProfileInfo = (props: ProfileInfoProps) => {
    return (
        <div className="profile-info">
            <div className="name-section">
                <h1 className="profile-name">{props.name}</h1>
                {!props.terminated && !props.notice && <span className="status-badge status-active">Active</span>}
                {props.notice && !props.terminated && (
                    <span className="status-badge status-notice">
                        <NoticeIcon width={14} />
                        Notice
                    </span>
                )}
                {props.terminated && <span className="status-badge status-terminated">Terminated</span>}
            </div>
            <div className="profile-details">
                <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span>{props.email}</span>
                </div>
            </div>
        </div >
    )
}

const ObservationSection = (props: { observations: Observation[]; currentUserId: number }) => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <ObservationIcon />
                Observations
            </h2>
            <Observations observations={props.observations} currentUserId={props.currentUserId} />
        </div>
    )
}

const FeedbackSection = (props: { feedbacks: Feedback[]; canDeliver: boolean; currentUserId: number }) => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <FeedbackIcon />
                Feedback
            </h2>
            <Feedbacks feedbacks={props.feedbacks} canDeliver={props.canDeliver} currentUserId={props.currentUserId} />
        </div>
    )
}

type MainContentProps = {
    intern: Intern;
    feedbacks: Feedback[];
    observations: Observation[];
    batchId: number;
    batchName: string;
    permissions: Permissions;
    currentUserId: number;
}

const MainContent = (props: MainContentProps) => {
    return (
        <div className="intern-container">
            <div className="intern-header">
                <div className="intern-profile-section">
                    <div style={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        borderRadius: '8px',
                        outline: props.intern.notice && !props.intern.terminated ? '3px solid #ef4444' : undefined,
                        outlineOffset: '2px',
                        flexShrink: 0,
                    }}>
                        <Image
                            src={props.intern.imgUrl}
                            alt={props.intern.name}
                            width={150}
                            height={150}
                            loading="lazy"
                            sizes="(max-width: 768px) 120px, 150px"
                            style={{ borderRadius: '8px', display: 'block' }}
                        />
                        {props.intern.terminated && (
                            <>
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', borderRadius: '8px' }} />
                                <AlertOctagon
                                    color="#ef4444"
                                    size={22}
                                    strokeWidth={2}
                                    style={{ position: 'absolute', top: 6, right: 6 }}
                                />
                            </>
                        )}
                        {props.intern.notice && !props.intern.terminated && (
                            <div style={{
                                position: 'absolute', top: 6, right: 6,
                                background: '#fff',
                                borderRadius: '50%',
                                width: 28, height: 28,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                            }}>
                                <AlertTriangle color="#ef4444" size={18} strokeWidth={2.5} />
                            </div>
                        )}
                    </div>

                    <ProfileInfo
                        name={props.intern.name}
                        email={props.intern.email}
                        terminated={props.intern.terminated}
                        notice={props.intern.notice}
                    />
                </div>
                <QuickActions
                    permissions={props.permissions}
                    batchId={props.batchId}
                    batchName={props.batchName}
                    internId={props.intern.id}
                    internName={props.intern.name}
                    notice={props.intern.notice}
                    terminated={props.intern.terminated}
                />
            </div>
            <div className="content-grid">
                <ObservationSection observations={props.observations} currentUserId={props.currentUserId} />
                <FeedbackSection feedbacks={props.feedbacks} canDeliver={props.permissions.programManager} currentUserId={props.currentUserId} />
            </div>
        </div>
    )
}

// Streaming data components
const InternDataProvider = async (props: {
    batchId: number;
    internId: number;
    permissions: Promise<Permissions>;
    currentUserId: number;
}) => {
    const [permissions, intern, feedbacks, observations, batchName] = await Promise.all([
        props.permissions,
        fetchIntern(props.internId),
        fetchFeedbacks(props.internId),
        fetchObservations(props.internId),
        fetchBatchName(props.batchId),
    ]);

    feedbacks.forEach((feedback) => feedback.internName = intern.name);
    observations.forEach((observation) => observation.internName = intern.name);

    return (
        <MainContent
            intern={intern}
            feedbacks={feedbacks}
            observations={observations}
            batchId={props.batchId}
            batchName={batchName}
            permissions={permissions}
            currentUserId={props.currentUserId}
        />
    );
};

const InternPage = async ({ params }: { params: Promise<{ batchId: number; internId: number; }> }) => {
    const { batchId, internId } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user.id || -1;
    
    const permissionsPromise = fetchPermissions(userId, batchId, session?.user.isRoot || false);

    return (
        <div className="main-container">
            <div className="page-container">
                <div className="main-content">
                    <AppHeader />
                    <div className="content">
                        <Suspense fallback={
                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                                    <Skeleton width="150px" height="150px" />
                                    <div style={{ flex: 1 }}>
                                        <Skeleton width="200px" height="32px" />
                                        <div style={{ marginTop: "10px" }}>
                                            <Skeleton width="300px" height="20px" />
                                        </div>
                                    </div>
                                </div>
                                <Skeleton width="100%" height="300px" />
                                <div style={{ marginTop: "10px", color: "#6c757d" }}>Loading intern profile...</div>
                            </div>
                        }>
                            <InternDataProvider
                                batchId={batchId}
                                internId={internId}
                                permissions={permissionsPromise}
                                currentUserId={userId}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InternPage;
