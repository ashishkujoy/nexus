"use client";

import { useState } from "react";
import "./batchPageTab.css";
import { Intern } from "./page";
import { formatDate } from "../../date";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type TabNavProps = {
    activeTab: string;
    tabs: string[];
    onTabChange: (tab: string) => void;
}

const TabBtn = (props: { title: string, active: boolean, onClick: () => void }) => {
    return (
        <button className={`tab-btn ${props.active && "active"}`} onClick={props.onClick}>{props.title}</button>
    )
}

const TabNav = (props: TabNavProps) => {
    return (
        <div className="tabs-nav">
            {props.tabs.map(tab => <TabBtn
                key={tab}
                title={tab}
                active={tab === props.activeTab}
                onClick={() => props.onTabChange(tab)}
            />)}
        </div>
    )
}

const InternCard = (props: { name: string; colorCode?: string }) => {
    const initials = props.name.split(" ").map(word => word[0]).join("").toUpperCase();
    const gotoInternProfile = () => window.location.href = window.location.pathname + `/intern/${props.name}`;

    return (
        <div className="intern-card" onClick={gotoInternProfile}>
            <div className="intern-photo">{initials}</div>
            <div className={`intern-footer ${props.colorCode || "no-color"}`}>{props.name}</div>
        </div>
    )
}

type InternsTabProps = {
    interns: Intern[];
    active: boolean;
}

const InternsTab = (props: InternsTabProps) => {
    return (
        <div id="interns" className={`tab-content ${props.active && "active"}`}>
            <div className="interns-grid">
                {props.interns.map(intern => <InternCard
                    key={intern.id}
                    name={intern.name}
                    colorCode={intern.colorCode}
                />)}
            </div>
        </div>
    )
}

type Observation = {
    id: number;
    internName: string;
    mentorName: string;
    date: Date;
    content: string;
}

const ObservationItem = (props: { observation: Observation }) => {
    const [viewMore, setViewMore] = useState(false);
    const { observation: { internName, mentorName, date, content } } = props;
    const toggleViewMore = () => setViewMore(!viewMore);

    return (
        <div className="observation-item">
            <div className="observation-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="observation-intern">{internName}</div>
                <div>
                    <span className="observation-type">{mentorName}</span>
                    <span className="observation-date">{formatDate(date)}</span>
                </div>
            </div>
            <div className={`observation-text ${!viewMore && "view-less"}`}>
                {content}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={toggleViewMore} className="view-more-btn">
                    {viewMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <span>{viewMore ? "View Less" : "View More"}</span>
                </button>
            </div>
        </div>
    )
}

type ObservationsTabProps = {
    active: boolean;
    observations: Observation[];
}

const ObservationsTab = (props: ObservationsTabProps) => {
    return (
        <div id="observations" className={`tab-content ${props.active && "active"}`}>
            <div className="observations-list">
                {
                    props.observations.map(observation => <ObservationItem
                        key={observation.id}
                        observation={observation}
                    />)
                }
            </div>
        </div>
    )
}

const BatchPageTab = (props: { interns: Intern[]; observations: Observation[] }) => {
    const [activeTab, setActiveTab] = useState("Interns");
    const tabs = ["Interns", "Observations", "Feedbacks"];

    return (
        <div>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            <InternsTab interns={props.interns} active={activeTab === tabs[0]} />
            <ObservationsTab active={activeTab === tabs[1]} observations={props.observations} />
        </div>
    )
}

export default BatchPageTab;