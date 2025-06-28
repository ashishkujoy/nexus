import { FeedbackIcon, InternIcon, ObservationIcon } from "@/app/components/Icons";

import AppHeader from "@/app/components/AppHeader";
import { Skeleton } from "@/app/components/Skeleton";
import { ReactNode, Suspense } from "react";
import { fetchBatch, fetchInterns, fetchStats } from "./action";
import BatchPageHeader from "./BatchPageHeader";
import InternRow from "./InternRow";
import "./page.css";
import QuickActions from "./QuickActionsSection";


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

const LoadingRow = () => {
    return (
        <tr className="intern-row">
            <td>
                <Skeleton width="100%" height="20px" />
            </td>
            <td>
                <Skeleton width="100%" height="20px" className="table-cell" />
            </td>
            <td>
                <Skeleton width="100px" height="20px" className="table-cell" />
            </td>
        </tr>
    )
}

const LoadingRows = () => {
    return <tbody>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
    </tbody>
}

type Intern = {
    id: number;
    name: string;
    colorCode?: string;
    notice: boolean;
}

const InternRows = async (props: { interns: Promise<Intern[]> }) => {
    const interns = await props.interns;

    return (
        <tbody>
            {
                interns.map(intern => <InternRow
                    key={intern.id}
                    id={intern.id}
                    name={intern.name}
                    colorCode={intern.colorCode || undefined}
                    notice={intern.notice}
                />)
            }
        </tbody>
    )
}

const InternsList = (props: { interns: Promise<Intern[]> }) => {
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
            <div className="card-body" style={{ padding: "0", maxHeight: "500px", overflowY: "auto" }}>
                <table className="interns-table">
                    <thead>
                        <tr>
                            <th>Intern</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <Suspense fallback={<LoadingRows />}>
                        <InternRows interns={props.interns} />
                    </Suspense>
                </table>
            </div>
        </div>
    )
}

const RightSidebarSection = async (props: { interns: Promise<Intern[]>, batch: Batch }) => {
    const interns = await props.interns;
    return (
        <div className="sidebar-section">
            <QuickActions interns={interns} batch={props.batch} />
            <RecentActivities />
        </div>
    )
}

const ContentGrid = (props: { batch: Batch; interns: Promise<Intern[]> }) => {
    return (
        <div className="content-grid">
            <InternsList interns={props.interns} />
            <RightSidebarSection interns={props.interns} batch={props.batch} />
        </div>
    )
}

type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: Promise<number>;
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
            <div className="stat-value">
                <Suspense fallback={<Skeleton width="100px" height="24px" />}>
                    <StatsValue value={props.value} />
                </Suspense>
            </div>
            {props.subtitle && <div className="stat-subtitle">{props.subtitle}</div>}
        </div>
    )
}

type Stat = {
    totalInterns: number;
    pendingObservations: number;
    pendingFeedback: number;
    activeNotices: number;
}

const StatsValue = async (props: { value: Promise<number> }) => {
    const value = await props.value;

    return <span>{value}</span>
}

const Stats = (props: { batchId: number }) => {
    const stats = fetchStats(props.batchId);
    return (
        <div className="stats-grid">
            <StatCard
                icon={<div className="stat-icon" style={{ background: "#e3f2fd" }}>
                    <InternIcon />
                </div>}
                title="Total Interns"
                value={stats.then(s => s.totalInterns)}
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
                value={stats.then(s => s.pendingObservations)}
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
                value={stats.then(s => s.pendingFeedback)}
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
                value={stats.then(s => s.activeNotices)}
                subtitle="Requires attention"
                trend="+1 critical"
            />
        </div>
    )
}

type Batch = {
    id: number;
    name: string;
    startDate: Date;
    endDate?: Date;
}

const MainContent = (props: Batch) => {
    const internsPromise = fetchInterns(props.id);

    return (
        <main className="content">
            <BatchPageHeader
                title={props.name}
                startDate={props.startDate}
                batchId={props.id}
            />
            <Stats batchId={props.id} />
            <ContentGrid batch={props} interns={internsPromise} />
        </main>
    )
}

const BatchPage = async ({ params }: { params: Promise<{ batchId: number }> }) => {
    const { batchId } = await params;
    const batch = await fetchBatch(batchId);

    return (
        <div className="main-container">
            <div className="page-container">
                <div className="main-content">
                    <AppHeader />
                    <MainContent {...batch} />
                </div>
            </div>
        </div>
    )
}

export default BatchPage;