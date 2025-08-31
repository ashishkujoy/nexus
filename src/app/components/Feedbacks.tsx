"use client";
import { FormEvent, useState, memo, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useModalStore } from "../stores/modalStore";
import { Feedback, type FeedbackConversation } from "../batch/[batchId]/types";
import { formatDate } from "../date";

import "./feedbacks.css";
import MarkdownRenderer from "./MarkdownView";

// Dynamic imports for conditionally rendered components
const ErrorOverlay = dynamic(() => import("./ErrorOverlay"), { ssr: false });
const LoaderOverlay = dynamic(() => import("./LoaderOverlay"), { ssr: false });
const SuccessOverlay = dynamic(() => import("./SuccessOverlay"), { ssr: false });

type DeliveryModalProps = {
    feedback: Feedback;
    onClose: () => void;
    onDeliver: () => void;
}

const DeliveryModal = (props: DeliveryModalProps) => {
    const deliverMutation = useMutation({
        mutationFn: async (conversationText: string) => {
            const response = await fetch(`/api/feedbacks/${props.feedback.id}/deliver`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conversation: conversationText,
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to mark feedback as delivered. Please try again.");
            }
            
            return response.json();
        },
        onSuccess: () => {
            props.onDeliver();
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const conversationText = formData.get("conversation") as string;
        
        if (deliverMutation.isPending) {
            return;
        }
        
        deliverMutation.mutate(conversationText);
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
                    <MarkdownRenderer content={props.feedback.content} />
                    <input className="feedback-input" id="feedbackText" defaultValue={props.feedback.content} readOnly hidden/>
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
            {deliverMutation.isPending && <LoaderOverlay title="Hold On" message="Marking feedback as delivered..." />}
            {deliverMutation.isSuccess && <SuccessOverlay title="Success" message="Feedback marked as delivered successfully." onClose={props.onDeliver} />}
            {deliverMutation.isError && <ErrorOverlay title="Error" message={deliverMutation.error?.message || "An error occurred while marking feedback as delivered. Please try again."} onClose={() => deliverMutation.reset()} />}
        </div>
    )
}

const FeedbackConversation = memo((props: { feedback: Feedback; hidden: boolean }) => {
    const { data: conversation, isLoading, error } = useQuery({
        queryKey: ['feedback-conversation', props.feedback.id],
        queryFn: async () => {
            const response = await fetch(`/api/feedbacks/${props.feedback.id}/conversation`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch conversation');
            }
            const conv = await response.json();
            return { ...conv, date: new Date(Date.parse(conv.date as string)) };
        },
        enabled: !props.hidden,
    });

    if (isLoading) {
        return (
            <div className={`conversation-section ${props.hidden && "hidden"}`}>
                <div className="conversation-header">
                    <div className="conversation-title">Feedback Conversation</div>
                </div>
                <div className="conversation-content">Loading Conversation ...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`conversation-section ${props.hidden && "hidden"}`}>
                <div className="conversation-header">
                    <div className="conversation-title">Feedback Conversation</div>
                </div>
                <div className="conversation-content">Failed to load conversation</div>
            </div>
        );
    }

    return (
        <div className={`conversation-section ${props.hidden && "hidden"}`}>
            <div className="conversation-header">
                <div className="conversation-title">Feedback Conversation</div>
                <small style={{ color: "#6c757d" }}>Delivered on: {formatDate(conversation?.deliveredAt || new Date())}</small>
            </div>
            <div className="conversation-content">
                <MarkdownRenderer content={conversation?.content || ''} />
            </div>
        </div>
    )
})

FeedbackConversation.displayName = 'FeedbackConversation';

const FeedbackCard = memo((props: { feedback: Feedback, canDeliver: boolean }) => {
    const { feedback, canDeliver } = props;
    const queryClient = useQueryClient();
    const router = useRouter();
    const { deliveryModalFeedbackId, openDeliveryModal, closeDeliveryModal } = useModalStore();
    const [collapsed, setCollapsed] = useState(true);
    const [showConversation, setShowConversation] = useState(false);
    const toggleShowConversation = () => setShowConversation(!showConversation);
    const toggleCollapsed = () => setCollapsed(!collapsed);
    
    const isDeliveryModalOpen = deliveryModalFeedbackId === feedback.id;

    return (
        <div>
            <div className={`feedback-card ${feedback.colorCode}-card`}>
                <div className="feedback-header">
                    <div className="feedback-info">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <div className="feedback-name">{feedback.internName}</div>
                            <div className={`feedback-status status-${feedback.delivered ? "delivered" : "pending"}`}>
                                {feedback.delivered ? "Delivered" : "Pending"}
                            </div>
                        </div>
                        <div className="feedback-meta">
                            <div className="feedback-author">{feedback.mentorName}</div>
                            <div className="feedback-date">{formatDate(feedback.date)}</div>
                        </div>
                        <div className={`feedback-content ${collapsed && "view-less"}`}>
                            <MarkdownRenderer content={feedback.content} />
                        </div>
                    </div>
                </div>

                <div className="feedback-actions">
                    {feedback.delivered && <button className="action-btn btn-view-conversation" onClick={toggleShowConversation}>View Conversation</button>}
                    {canDeliver && !feedback.delivered && <button className="action-btn btn-deliver" onClick={() => openDeliveryModal(feedback.id)}>Mark as Delivered</button>}
                    <button className="action-btn btn-secondary" onClick={toggleCollapsed}>{collapsed ? "View More" : "View Less"}</button>
                </div>
                <FeedbackConversation feedback={feedback} hidden={!showConversation} />
            </div>

            {isDeliveryModalOpen && <DeliveryModal feedback={feedback} onClose={closeDeliveryModal} onDeliver={() => {
                closeDeliveryModal();
                queryClient.invalidateQueries({ queryKey: ['feedback-conversation'] });
                queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
                router.refresh(); // Refresh server-side data
            }} />}
        </div>
    )
})

FeedbackCard.displayName = 'FeedbackCard';

const Feedbacks = memo((props: { feedbacks: Feedback[]; canDeliver: boolean }) => {
    // Memoize the feedback cards rendering to prevent unnecessary re-renders
    const feedbackCards = useMemo(() => 
        props.feedbacks.map(feedback => (
            <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                canDeliver={props.canDeliver}
            />
        )), 
        [props.feedbacks, props.canDeliver]
    );

    return (
        <div className="observations-list">
            {feedbackCards}
        </div>
    )
})

Feedbacks.displayName = 'Feedbacks';

export default Feedbacks;