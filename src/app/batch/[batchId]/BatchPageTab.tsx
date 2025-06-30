"use client";

import Observations from "@/app/components/Observations";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "../../date";
import "./batchPageTab.css";
import { Intern } from "./page";
import { Feedback, Observation } from "./types";

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

const InternCard = (props: { name: string; id: number; colorCode?: string; imgUrl: string; }) => {
    const gotoInternProfile = () => window.location.href = window.location.pathname + `/intern/${props.id}`;

    return (
        <div className="intern-card" onClick={gotoInternProfile}>
            <Image src={props.imgUrl} width={140} height={130} alt={""} style={{ objectFit: "cover" }} />
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
                    id={intern.id}
                    name={intern.name}
                    imgUrl={intern.imgUrl}
                    colorCode={intern.colorCode}
                />)}
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
            <Observations observations={props.observations} />
        </div>
    )
}

type FeedbacksTabProps = {
    active: boolean;
    feedbacks: Feedback[];
}

const FeedbackItem = (props: { feedback: Feedback }) => {
    const { feedback: { internName, mentorName, date, content, } } = props;

    return (
        <div className="feedback-item">
            <div className="feedback-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="feedback-intern">{internName}</div>
                <div>
                    <span className="observation-type">{mentorName}</span>
                    <span className="observation-date">{formatDate(date)}</span>
                </div>
            </div>
            <div className="feedback-content">
                {content}
            </div>
        </div>
    )
}

const FeedbacksTab = (props: FeedbacksTabProps) => {
    return (
        <div id="feedback" className={`tab-content ${props.active && "active"}`}>
            <div className="feedback-list">
                {
                    props.feedbacks.map(feedback => <FeedbackItem
                        key={feedback.id}
                        feedback={feedback}
                    />)
                }
            </div>
        </div>
    )
}

const BatchPageTab = (props: { interns: Intern[]; observations: Observation[]; feedbacks: Feedback[] }) => {
    const [activeTab, setActiveTab] = useState("Interns");
    const tabs = ["Interns", "Observations", "Feedbacks"];

    return (
        <div>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            <InternsTab interns={props.interns} active={activeTab === tabs[0]} />
            <ObservationsTab active={activeTab === tabs[1]} observations={props.observations} />
            <FeedbacksTab active={activeTab === tabs[2]} feedbacks={props.feedbacks} />
        </div>
    )
}

export default BatchPageTab;