import AppHeader from "@/app/components/AppHeader";
import Feedbacks from "@/app/components/Feedbacks";
import { FeedbackIcon, NoticeIcon, ObservationIcon, PlusIcon, TerminateIcon } from "@/app/components/Icons";
import Observations from "@/app/components/Observations";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Intern } from "../../page";
import { Feedback, Observation, Permissions } from "../../types";
import { fetchFeedbacks, fetchIntern, fetchObservations, fetchPermissions } from "./action";
import "./page.css";

type ProfileInfoProps = {
    name: string;
    email: string;
}

const ProfileInfo = (props: ProfileInfoProps) => {
    return (
        <div className="profile-info">
            <h1 className="profile-name">{props.name}</h1>
            <div className="profile-details">
                <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span>{props.email}</span>
                </div>
            </div>
        </div >
    )
}

const QuickActions = (props: { permissions: Permissions }) => {
    const { recordObservation, recordFeedback, programManager } = props.permissions;

    return (
        <div className="quick-actions">
            {
                (recordObservation || programManager) && <button className="action-btn btn-primary">
                    <PlusIcon />
                    Record Observation
                </button>

            }
            {
                (recordFeedback || programManager) && <button className="action-btn btn-secondary">
                    <PlusIcon />
                    Record Feedback
                </button>
            }
            {
                programManager && <button className="action-btn btn-warning">
                    <NoticeIcon width={16} heigth={16} />
                    Mark Notice
                </button>
            }
            {
                programManager && <button className="action-btn btn-danger">
                    <TerminateIcon />
                    Terminate
                </button>
            }
        </div>
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

const FeedbackSection = (props: { feedbacks: Feedback[] }) => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <FeedbackIcon />
                Feedback
            </h2>
            <Feedbacks feedbacks={props.feedbacks} />
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
                    />
                </div>
                <QuickActions permissions={props.permissions} />
            </div>
            <div className="content-grid">
                <ObservationSection observations={props.observations} />
                <FeedbackSection feedbacks={props.feedbacks} />
            </div>
        </div>
    )
}

const InternPage = async ({ params }: { params: Promise<{ batchId: number; internId: number; }> }) => {
    const { batchId, internId } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user.id || -1;

    const [permissions, intern, feedbacks, observations] = await Promise.all([
        fetchPermissions(userId, batchId, session?.user.isRoot || false),
        fetchIntern(internId),
        fetchFeedbacks(internId),
        fetchObservations(internId),
    ]);

    feedbacks.forEach((feedback) => feedback.internName = intern.name);
    observations.forEach((observation) => observation.internName = intern.name);

    return (
        <div className="main-container">
            <div className="page-container">
                <div className="main-content">
                    <AppHeader />
                    <MainContent
                        intern={intern}
                        feedbacks={feedbacks}
                        observations={observations}
                        batchId={batchId}
                        permissions={permissions}
                    />
                </div>
            </div>
        </div>
    );
}

export default InternPage;
