"use client";
import { useState } from "react";
import { Observation } from "../batch/[batchId]/types";
import { formatDate } from "../date";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

import "./observations.css";

const ObservationItem = (props: { observation: Observation }) => {
    const [viewMore, setViewMore] = useState(false);
    const { observation: { internName, mentorName, date, content } } = props;
    const toggleViewMore = () => setViewMore(!viewMore);

    return (
        <div className="observation-item">
            <div className="observation-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="observation-intern">{internName}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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

const Observations = (props: { observations: Observation[] }) => {
    return (
        <div className="observations-list">
            {
                props.observations.map(observation => <ObservationItem
                    key={observation.id}
                    observation={observation}
                />)
            }
        </div>
    )
}

export default Observations;