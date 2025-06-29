"use client";

import { useState } from "react";
import "./batchPageTab.css";
import { Intern } from "./page";

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

const BatchPageTab = (props: { interns: Intern[] }) => {
    const [activeTab, setActiveTab] = useState("Interns");
    const tabs = ["Interns", "Observations", "Feedbacks"];

    return (
        <div>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            <InternsTab interns={props.interns} active={activeTab === tabs[0]} />
        </div>
    )
}

export default BatchPageTab;