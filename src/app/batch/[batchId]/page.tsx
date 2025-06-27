import { FeedbackIcon, InternIcon, NoticeIcon, ObservationIcon } from "@/app/components/Icons";

import AppHeader from "@/app/components/AppHeader";
import { ReactNode } from "react";
import BatchPageHeader from "./BatchPageHeader";
import "./page.css";

type QuickActionProps = {
    title: string;
    description: string;
    iconBackground: string;
    icon: ReactNode;
}

const QuickAction = (props: QuickActionProps) => {
    return (
        <div className="quick-action">
            <div className="quick-action-icon" style={{ background: props.iconBackground }}>
                {props.icon}
            </div>
            <div className="quick-action-text">
                <div className="quick-action-title">{props.title}</div>
                <div className="quick-action-desc">{props.description}</div>
            </div>
        </div>
    )
}

const QuickActions = () => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-body">
                <QuickAction
                    title="Record Observation"
                    description="Add new observation for intern"
                    iconBackground="#e3f2fd"
                    icon={<ObservationIcon />}
                />
                <QuickAction
                    title="Provide Feedback"
                    description="Give feedback to intern"
                    iconBackground="#e8f5e8"
                    icon={<FeedbackIcon />}
                />
            </div>
        </div>
    )
}

type ActionsProps = {
    internName: string;
    type: string;
    time: string;
    icon: ReactNode;
    background: string;
    color: string;
}

const Activity = (props: ActionsProps) => {
    return (
        <div className="activity-item">
            <div className="activity-icon" style={{ background: props.background, color: props.color }}>
                {props.icon}
            </div>
            <div className="activity-content">
                <div className="activity-text">
                    <strong>{props.internName}</strong> {props.type}
                </div>
                <div className="activity-time">{props.time}</div>
            </div>
        </div>
    )
}

const RecentActivities = () => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-body">
                <Activity
                    internName={"James Smith"}
                    type={"observation recorded"}
                    time={"2 hour ago"}
                    icon={<ObservationIcon />}
                    background={"#e3f2fd"}
                    color={"#1976d2"}
                />
                <Activity
                    internName={"Avacado Mishra"}
                    type={"feedback delivered"}
                    time={"25 min ago"}
                    icon={<FeedbackIcon />}
                    background={"#e8f5e8"}
                    color={"#2e7d32"}
                />
            </div>
        </div>
    )
}

type InternRowProps = {
    name: string;
    colorCode?: string;
    notice: boolean;
}

const NoticeBadge = () => {
    return (
        <div className="notice-container">
            <NoticeIcon />
        </div>
    )
}

const Status = (props: { colorCode?: string; notice: boolean }) => {
    return (
        <td className="table-cell">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={`color-badge color-${props.colorCode || "none"}`}></span>
                {props.notice && <NoticeBadge />}

            </div>
        </td>
    )
}

const InternRow = (props: InternRowProps) => {
    return (
        <tr className="intern-row">
            <td>
                <div className="intern-name">
                    <div>
                        <div style={{ fontWeight: "500" }}>{props.name}</div>
                    </div>
                </div>
            </td>
            <Status colorCode={props.colorCode} notice={props.notice} />
            <td>
                <button className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "12px" }}>View</button>
            </td>
        </tr>
    )
}

const InternsList = () => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Batch Interns</h3>
                <div className="intern-filter-section">
                    <select
                        className="filter-dropdown">
                        <option>All Interns</option>
                        <option>Active</option>
                        <option>Needs Attention</option>
                        <option>Critical</option>
                    </select>
                    <button className="btn btn-secondary filter-btn">Filter</button>
                </div>
            </div>
            <div className="card-body" style={{ padding: "0" }}>
                <table className="interns-table">
                    <thead>
                        <tr>
                            <th>Intern</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <InternRow name="John Doe" colorCode="green" notice={false} />
                        <InternRow name="Jane Smith" colorCode="orange" notice={false} />
                        <InternRow name="Mike Wilson" colorCode="yellow" notice={false} />
                        <InternRow name="Alice Brown" colorCode="red" notice={true} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const RightSidebarSection = () => {
    return (
        <div className="sidebar-section">
            <QuickActions />
            <RecentActivities />
        </div>
    )
}

const ContentGrid = () => {
    return (
        <div className="content-grid">
            <InternsList />
            <RightSidebarSection />
        </div>
    )
}

type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: number;
    subtitle?: string;
    trend?: string;
    down?: boolean;
}

const StatCard = (props: StatCardProps) => {
    return (
        <div className="stat-card">
            <div className="stat-header">
                {props.icon}
                <div className="stat-title">{props.title}</div>
            </div>
            <div className="stat-value">{props.value}</div>
            {props.subtitle && <div className="stat-subtitle">{props.subtitle}</div>}
            {props.trend && <div className={`stat-trend ${props.down ? "trend-down" : "trend-up"}`}>{props.trend}</div>}
        </div>
    )
}

const Stats = () => {
    return (
        <div className="stats-grid">
            <StatCard
                icon={<div className="stat-icon" style={{ background: "#e3f2fd" }}>
                    <InternIcon />
                </div>}
                title="Total Interns"
                value={35}
                subtitle="Active participants"
                trend="+3 this week"
            />
            <StatCard
                icon={<div className="stat-icon" style={{ background: "#e8f5e8" }}>
                    <svg width="20" height="20" fill="#2e7d32" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>}
                title="Pending Observations"
                value={5}
                subtitle="Awaiting review"
                trend="-2 since yesterday"
                down
            />

            <StatCard
                icon={<div className="stat-icon" style={{ background: "#fff3e0" }}>
                    <svg width="20" height="20" fill="#f57c00" viewBox="0 0 20 20">
                        <path
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>}
                title="Pending Feedback"
                value={8}
                subtitle="Due this week"
                trend="+1 new"
            />

            <StatCard
                icon={<div className="stat-icon" style={{ background: "#ffebee" }}>
                    <svg width="20" height="20" fill="#d32f2f" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                    </svg>
                </div>}
                title="Active Notices"
                value={2}
                subtitle="Requires attention"
                trend="+1 critical"
            />
        </div>
    )
}

const MainContent = (props: { batchId: number }) => {
    return (
        <main className="content">
            <BatchPageHeader title="STEP 2025" startDate={new Date(Date.parse("2025-07-02T00:00:02.000Z"))} batchId={props.batchId} />
            <Stats />
            <ContentGrid />
        </main>
    )
}

const BatchPage = async ({ params }: { params: Promise<{ batchId: number }> }) => {
    const { batchId } = await params;
    console.log("Batch ID:", batchId);

    return (
        <div className="main-container">
            <div className="page-container">
                <div className="main-content">
                    <AppHeader />
                    <MainContent batchId={batchId} />
                </div>
            </div>
        </div>
    )
}

export default BatchPage;