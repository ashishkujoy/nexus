import AppHeader from "@/app/components/AppHeader";
import Feedbacks from "@/app/components/Feedbacks";
import { FeedbackIcon, NoticeIcon, ObservationIcon } from "@/app/components/Icons";
import Observations from "@/app/components/Observations";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/app/components/Skeleton";
import { Intern } from "../../page";
import { Feedback, Observation, Permissions } from "../../types";
import { fetchFeedbacks, fetchIntern, fetchObservations, fetchPermissions } from "./action";
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
                {
                    props.notice && !props.terminated && <span className="notice-badge">
                        <NoticeIcon width={16} />
                        Notice
                    </span>
                }
                {
                    props.terminated && <span className="terminated-badge">Terminated</span>
                }
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

const ObservationSection = (props: { observations: Observation[] }) => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <ObservationIcon />
                Observations
            </h2>
            <Observations observations={props.observations} />
        </div>
    )
}

const FeedbackSection = (props: { feedbacks: Feedback[]; canDeliver: boolean }) => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <FeedbackIcon />
                Feedback
            </h2>
            <Feedbacks feedbacks={props.feedbacks} canDeliver={props.canDeliver} />
        </div>
    )
}

type MainContentProps = {
    intern: Intern;
    feedbacks: Feedback[];
    observations: Observation[];
    batchId: number;
    permissions: Permissions;
}

const MainContent = (props: MainContentProps) => {
    return (
        <div className="intern-container">
            <div className="intern-header">
                <div className="intern-profile-section">
                    <Image
                        src={props.intern.imgUrl}
                        alt={props.intern.name}
                        width={150}
                        height={150} />

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
                    internId={props.intern.id}
                    notice={props.intern.notice}
                    terminated={props.intern.terminated}
                />
            </div>
            <div className="content-grid">
                <ObservationSection observations={props.observations} />
                <FeedbackSection feedbacks={props.feedbacks} canDeliver={props.permissions.programManager} />
            </div>
        </div>
    )
}

// Streaming data components
const InternDataProvider = async (props: { 
    batchId: number; 
    internId: number; 
    permissions: Promise<Permissions>;
}) => {
    const [permissions, intern, feedbacks, observations] = await Promise.all([
        props.permissions,
        fetchIntern(props.internId),
        fetchFeedbacks(props.internId),
        fetchObservations(props.internId),
    ]);

    feedbacks.forEach((feedback) => feedback.internName = intern.name);
    observations.forEach((observation) => observation.internName = intern.name);

    return (
        <MainContent
            intern={intern}
            feedbacks={feedbacks}
            observations={observations}
            batchId={props.batchId}
            permissions={permissions}
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
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default InternPage;
