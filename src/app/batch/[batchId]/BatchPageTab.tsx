"use client";

import Feedbacks from "@/app/components/Feedbacks";
import Observations from "@/app/components/Observations";
import Image from "next/image";
import { useEffect, useMemo, useState, memo, useCallback } from "react";
import "./batchPageTab.css";
import { Intern } from "./page";
import { Feedback, Observation } from "./types";
import FilterSection, { Filter } from "@/app/components/BatchFilterSection";
import Link from "next/link";

type TabNavProps = {
    activeTab: string;
    tabs: string[];
    onTabChange: (tab: string) => void;
}

const TabBtn = memo((props: { title: string, active: boolean, onClick: () => void }) => {
    return (
        <button className={`tab-btn ${props.active && "active"}`} onClick={props.onClick}>{props.title}</button>
    )
});

TabBtn.displayName = 'TabBtn';

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

const InternCard = memo((props: { name: string; id: number; colorCode?: string; imgUrl: string; batchId: number }) => {
    return (
        <Link href={`/batch/${props.batchId}/intern/${props.id}`} className="intern-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Image 
                src={props.imgUrl} 
                width={140} 
                height={130} 
                alt={props.name} 
                style={{ objectFit: "cover" }} 
                loading="lazy"
                sizes="(max-width: 768px) 120px, 140px"
            />
            <div className={`intern-footer ${props.colorCode || "no-color"}`}>{props.name}</div>
        </Link>
    )
}, (prevProps, nextProps) => {
    // Custom comparison for optimal performance
    return prevProps.id === nextProps.id && 
           prevProps.name === nextProps.name &&
           prevProps.colorCode === nextProps.colorCode &&
           prevProps.imgUrl === nextProps.imgUrl &&
           prevProps.batchId === nextProps.batchId;
});

InternCard.displayName = 'InternCard';

// Memoized grid component for better performance
const InternsGrid = memo(({ interns, batchId }: { interns: Intern[], batchId: number }) => {
    return (
        <div className="interns-grid">
            {interns.map(intern => <InternCard
                key={intern.id}
                id={intern.id}
                name={intern.name}
                imgUrl={intern.imgUrl}
                colorCode={intern.colorCode}
                batchId={batchId}
            />)}
        </div>
    );
});

InternsGrid.displayName = 'InternsGrid';

type InternsTabProps = {
    interns: Intern[];
    active: boolean;
    batchId: number;
}

const InternsTab = (props: InternsTabProps) => {
    return (
        <div id="interns" className={`tab-content ${props.active && "active"}`}>
            <InternsGrid interns={props.interns} batchId={props.batchId} />
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
    canDeliver: boolean;
}

const FeedbacksTab = (props: FeedbacksTabProps) => {
    return (
        <div id="feedback" className={`tab-content ${props.active && "active"}`}>
            <Feedbacks feedbacks={props.feedbacks} canDeliver={props.canDeliver} />
        </div>
    )
}

const getHash = () => window.location.hash.replace("#", "").toLocaleLowerCase();

const filterInterns = (interns: Intern[], filter: Filter) => {
    // Early return if no filters applied
    if (!filter.name && !filter.colorCode && filter.notice === undefined) {
        return interns;
    }

    // Pre-compute filter values to avoid repeated operations
    const nameFilter = filter.name?.toLowerCase();

    return interns.filter(intern => {
        if (nameFilter && !intern.name.toLowerCase().includes(nameFilter)) {
            return false;
        }
        if (filter.colorCode && intern.colorCode !== filter.colorCode) {
            return false;
        }
        if (filter.notice !== undefined && filter.notice !== intern.notice) {
            return false;
        }
        return true;
    });
}

const filterObservations = (observations: Observation[], filter: Filter) => {
    // Early return if no name filter
    if (!filter.name) {
        return observations;
    }

    const nameFilter = filter.name.toLowerCase();
    return observations.filter(obs => {
        return obs.internName.toLowerCase().includes(nameFilter);
    });
}

const filterFeedbacks = (feedbacks: Feedback[], filter: Filter) => {
    // Pre-compute filter values
    const nameFilter = filter.name?.toLowerCase();
    
    return feedbacks.filter(feedback => {
        if (nameFilter && !feedback.internName.toLowerCase().includes(nameFilter)) {
            return false;
        }
        if (filter.colorCode && feedback.colorCode !== filter.colorCode) {
            return false;
        }
        if (filter.notice && !feedback.notice) {
            return false;
        }
        if (filter.feedbacks === "All") return true;

        return filter.feedbacks === "Delivered" ? feedback.delivered : !feedback.delivered;
    });
}

const BatchPageTab = (props: {
    interns: Intern[];
    observations: Observation[];
    feedbacks: Feedback[];
    canDeliver: boolean;
    batchId: number;
}) => {
    const [activeTab, setActiveTab] = useState("Interns");
    const tabs = ["Interns", "Observations", "Feedbacks"];
    const [filter, setFilter] = useState<Filter>({
        name: "",
        colorCode: undefined,
        notice: undefined,
        feedbacks: "All"
    });

    const interns = useMemo(() => filterInterns(props.interns, filter), [filter, props.interns]);
    const observations = useMemo(() => filterObservations(props.observations, filter), [filter, props.observations]);
    const feedbacks = useMemo(() => filterFeedbacks(props.feedbacks, filter), [filter, props.feedbacks]);

    const onTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
        window.location.hash = tab.toLowerCase();
    }, []);

    useEffect(() => {
        const hash = getHash();
        if (activeTab.toLocaleLowerCase() !== hash) {
            switch (hash) {
                case "observations": return setActiveTab("Observations");
                case "feedbacks": return setActiveTab("Feedbacks");
                default: return setActiveTab("Interns");
            }
        }
    }, [activeTab]);

    return (
        <div>
            <TabNav activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
            <div>
                <FilterSection filter={filter} setFilter={(filter) => setFilter(filter)} activeTab={activeTab} />
                <InternsTab interns={interns} active={activeTab === tabs[0]} batchId={props.batchId} />
                <ObservationsTab active={activeTab === tabs[1]} observations={observations} />
                <FeedbacksTab active={activeTab === tabs[2]} feedbacks={feedbacks} canDeliver={props.canDeliver} />
            </div>
        </div>
    )
}

export default BatchPageTab;