import Image from "next/image";
import "./page.css";
import { FeedbackIcon, NoticeIcon, ObservationIcon, PlusIcon, TerminateIcon } from "@/app/components/Icons";

type ProfileInfoProps = {
    name: string;
    email: string;
    gender: string;
    batch: string;
    statusChanged: string;
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
                <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span>{props.gender}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Batch:</span>
                    <span>{props.batch}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status Changed:</span>
                    <span>{props.statusChanged}</span>
                </div>
            </div>

            <div className="batch-info">
                <div className="color-badge" style={{ backgroundColor: "#3b82f6" }}></div>
                <span className="status-badge status-active">Active</span>
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

type ObservationProps = {
    content: string;
    mentor: string;
    date: string;
    watchOut?: boolean;
}

const Observation = (props: ObservationProps) => {
    return (
        <div className="list-item">
            <div className="list-item-header">
                <div className="item-summary">{props.content}</div>
                {props.watchOut && <span className="watch-out-badge">Watch Out</span>}
            </div>
            <div className="item-meta">
                <span>{props.mentor}</span>
                <span>{props.date}</span>
            </div>
        </div>
    )
}

const ObservationSection = () => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <ObservationIcon />
                Observations
            </h2>
            <Observation
                content="Needs improvement in time management during sprint planning"
                mentor="Maria Garcia"
                date="Jun 20, 2024"
            />
            <Observation
                content="Excellent problem-solving skills demonstrated in debugging session"
                mentor="John Smith"
                date="Jun 25, 2024"
                watchOut={true}
            />
            <Observation
                content="lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                mentor="Emily Johnson"
                date="Jul 01, 2024"
            />
            <Observation
                content="Needs to improve communication skills during team meetings"
                mentor="David Lee"
                date="Jul 05, 2024"
                watchOut={true}
            />
        </div>
    )
}

type FeedbackProps = {
    content: string;
    mentor: string;
    date: string;
}

const Feedback = (props: FeedbackProps) => {
    return (
        <div className="list-item">
            <div className="list-item-header">
                <div className="item-summary">{props.content}</div>
            </div>
            <div className="item-meta">
                <span>{props.mentor}</span>
                <span>{props.date}</span>
            </div>
        </div>
    )
}

const FeedbackSection = () => {
    return (
        <div className="section-card">
            <h2 className="section-title">
                <FeedbackIcon />
                Feedback
            </h2>
            <Feedback 
                content="Great job on the recent project presentation, very well articulated"
                mentor="Michael Brown"
                date="Jun 15, 2024"
            />
            <Feedback
                content="Needs to work on code quality and documentation practices"
                mentor="Sarah Wilson"
                date="Jun 10, 2024"
            />
            <Feedback
                content="Excellent teamwork and collaboration during the last sprint"
                mentor="Chris Evans"
                date="Jun 05, 2024"
            />
        </div>
    )
}

const InternPage = () => {
    return (
        <div className="intern-container">
            <div className="intern-header">
                <div className="intern-profile-section">
                    <Image
                        src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`}
                        alt={"intern"}
                        width={100}
                        height={100} />

                    <ProfileInfo
                        name="Sarah Johnson"
                        email={"sarah.johnson@company.com"}
                        gender={"Female"}
                        batch={"STEP-2025"}
                        statusChanged={"Jan 15, 2024"}
                    />
                </div>
                <QuickActions />
            </div>
            <div className="content-grid">
                <ObservationSection />
                <FeedbackSection />
            </div>
        </div>

    );
}

export default InternPage;
