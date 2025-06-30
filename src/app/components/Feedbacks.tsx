"use client";
import { useState } from "react";
import { Feedback } from "../batch/[batchId]/types";
import { formatDate } from "../date";

import "./observations.css"; // Reusing the same CSS for styling
import { ChevronUpIcon, ChevronDownIcon, TriangleAlertIcon } from "lucide-react";

const ColorBadge = (props: { colorCode: string }) => {
    return (
        <div className={`color-badge ${props.colorCode}`}></div>
    )
}

const FeedbackItem = (props: { feedback: Feedback }) => {
    const [viewMore, setViewMore] = useState(false);
    const toggleViewMore = () => setViewMore(!viewMore);

    const { feedback: { internName, mentorName, date, content, notice, colorCode } } = props;

    return (
        <div className="observation-item">
            <div className="observation-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="observation-intern" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span>{internName}</span>
                    {colorCode && <ColorBadge colorCode={colorCode} />}
                    {notice && <TriangleAlertIcon color="red" size={18} />}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className="observation-type">{mentorName}</span>
                    <span className="observation-date">{formatDate(date)}</span>
                </div>
            </div>
            <div className="observation-text">
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

const Feedbacks = (props: { feedbacks: Feedback[] }) => {
    return (
        <div className="observations-list">
            {
                props.feedbacks.map(feedback => <FeedbackItem
                    key={feedback.id}
                    feedback={feedback}
                />)
            }
        </div>
    )
}

export default Feedbacks;