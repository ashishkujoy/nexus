import AppHeader from "@/app/components/AppHeader";
import { FeedbackIcon, NoticeIcon, ObservationIcon, PlusIcon, TerminateIcon } from "@/app/components/Icons";
import Image from "next/image";
import { Intern } from "../../page";
import { Feedback, Observation } from "../../types";
import { fetchFeedbacks, fetchIntern, fetchObservations } from "./action";
import "./page.css";
import Observations from "@/app/components/Observations";
import Feedbacks from "@/app/components/Feedbacks";

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

const QuickActions = () => {
    return (
        <div className="quick-actions">
            <button className="action-btn btn-primary">
                <PlusIcon />
                Record Observation
            </button>
            <button className="action-btn btn-secondary">
                <PlusIcon />
                Record Feedback
            </button>
            <button className="action-btn btn-warning">
                <NoticeIcon width={16} heigth={16} />
                Mark Notice
            </button>
            <button className="action-btn btn-danger">
                <TerminateIcon />
                Terminate
            </button>
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
                <QuickActions />
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
    const [intern, feedbacks, observations] = await Promise.all([
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
                    <MainContent intern={intern} feedbacks={feedbacks} observations={observations} batchId={batchId} />
                </div>
            </div>
        </div>
    );
}

export default InternPage;
