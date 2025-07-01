"use client";
import { FormEvent, useState } from "react";
import { Feedback } from "../batch/[batchId]/types";
import { formatDate } from "../date";

import ErrorOverlay from "./ErrorOverlay";
import "./feedbacks.css";
import LoaderOverlay from "./LoaderOverlay";
import SuccessOverlay from "./SuccessOverlay";

type DeliveryModalProps = {
    feedback: Feedback;
    onClose: () => void;
    onDeliver: () => void;
}

const DeliveryModal = (props: DeliveryModalProps) => {
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const conversationText = formData.get("conversation") as string;
        if (loadingMsg || successMsg || errorMsg) {
            return;
        }
        setLoadingMsg("Marking feedback as delivered...");
        fetch("/api/batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "DeliverFeedback",
                feedbackId: props.feedback.id,
                conversation: conversationText,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    return res.json()
                        .then(({ error }) => setErrorMsg(error || "Failed to mark feedback as delivered. Please try again."));
                }
                setSuccessMsg("Feedback marked as delivered successfully.");
            })
            .catch(() => setErrorMsg("An error occurred while marking feedback as delivered. Please try again."))
            .finally(() => setLoadingMsg(""));
    }

    return (
        <div id="deliveryModal" className="modal active">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="modal-title">Record Feedback Delivery</div>
                    <button className="close-btn" onClick={props.onClose}>&times;</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px" }}>
                    {props.feedback.colorCode && <div className="form-group" style={{ opacity: 0.6, display: "flex", alignItems: "center", gap: "10px" }}>
                        <label className="form-label" style={{ minWidth: "100px" }}>Color Code</label>
                        <input className="feedback-input" id="colorCode" defaultValue={props.feedback.colorCode} readOnly />
                    </div>}
                    {props.feedback.notice && <div className="form-group" style={{ opacity: 0.6, display: "flex", alignItems: "center", gap: "10px" }}>
                        <label className="form-label">Notice</label>
                        <input type="checkbox" checked className="feedback-input" id="notice" readOnly />
                    </div>}
                </div>
                <div className="form-group" style={{ opacity: 0.6 }}>
                    <label className="form-label">Feedback</label>
                    <input className="feedback-input" id="feedbackText" defaultValue={props.feedback.content} readOnly />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Conversation Record:</label>
                        <textarea className="conversation-input" id="conversationText" placeholder="" name="conversation" required></textarea>
                    </div>
                    <div className="feedback-actions">
                        <button className="action-btn btn-deliver" type="submit">Save & Mark as Delivered</button>
                        <button className="action-btn btn-secondary" onClick={props.onClose}>Cancel</button>
                    </div>
                </form>
            </div>
            {loadingMsg && <LoaderOverlay title="Hold On" message={loadingMsg} />}
            {successMsg && <SuccessOverlay title="Success" message={successMsg} onClose={props.onDeliver} />}
            {errorMsg && <ErrorOverlay title="Error" message={errorMsg} onClose={() => setErrorMsg("")} />}
        </div>
    )
}

const FeedbackCard = (props: { feedback: Feedback }) => {
    const { feedback } = props;
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showConversation, setShowConversation] = useState(false);
    const toggleDeliveryModal = () => setShowDeliveryModal(!showDeliveryModal);
    const toggleShowConversation = () => setShowConversation(!showConversation);

    return (
        <div>
            <div className={`feedback-card ${feedback.colorCode}-card`}>
                <div className="feedback-header">
                    <div className="feedback-info">
                        <div className="feedback-name">{feedback.internName}</div>
                        <div className="feedback-content">{feedback.content}</div>
                    </div>
                    <div className={`feedback-status status-${feedback.delivered ? "delivered" : "pending"}`}>
                        {feedback.delivered ? "Delivered" : "Pending"}
                    </div>
                </div>
                <div className="feedback-meta">
                    <div className="feedback-author">{feedback.mentorName}</div>
                    <div className="feedback-date">{formatDate(feedback.date)}</div>
                </div>
                <div className="feedback-actions">
                    {feedback.delivered && <button className="action-btn btn-view-conversation" onClick={toggleShowConversation}>View Conversation</button>}
                    {!feedback.delivered && <button className="action-btn btn-deliver" onClick={toggleDeliveryModal}>Mark as Delivered</button>}
                    <button className="action-btn btn-secondary" onClick={toggleShowConversation}>View More</button>
                </div>
                <div className={`conversation-section ${!showConversation && "hidden"}`}>
                    <div className="conversation-header">
                        <div className="conversation-title">Feedback Conversation</div>
                        <small style={{ color: "#6c757d" }}>Delivered on: 30/06/2025</small>
                    </div>
                    <div className="conversation-content">Sample conversation</div>
                </div>
            </div>

            {showDeliveryModal && <DeliveryModal feedback={feedback} onClose={toggleDeliveryModal} onDeliver={() => {
                toggleDeliveryModal();
                window.location.reload();
            }} />}
        </div>
    )
}

const Feedbacks = (props: { feedbacks: Feedback[] }) => {
    return (
        <div className="observations-list">
            {
                props.feedbacks.map(feedback => <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                />)
            }
        </div>
    )
}

export default Feedbacks;