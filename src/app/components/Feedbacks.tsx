import { Feedback } from "../batch/[batchId]/types";
import { formatDate } from "../date";

import "./observations.css"; // Reusing the same CSS for styling

const FeedbackItem = (props: { feedback: Feedback }) => {
    const { feedback: { internName, mentorName, date, content, } } = props;

    return (
        <div className="feedback-item">
            <div className="feedback-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="feedback-intern">{internName}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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

const Feedbacks = (props: { feedbacks: Feedback[] }) => {
    return (
        <div className="feedback-list">
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