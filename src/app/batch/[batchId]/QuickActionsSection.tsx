"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/app/components/Skeleton";
import { FeedbackIcon, ObservationIcon } from "@/app/components/Icons";
import { ReactNode, memo } from "react";
import type { Permissions } from "./types";
import { useModalStore } from "../../stores/modalStore";

// Lazy-loaded modals for better performance
const FeedbackModal = dynamic(() => import("@/app/components/FeedbackModal"), {
    loading: () => <Skeleton width="600px" height="400px" />,
    ssr: false
});

const ObservationModal = dynamic(() => import("@/app/components/ObservationModal"), {
    loading: () => <Skeleton width="600px" height="400px" />,
    ssr: false
});

type QuickActionProps = {
    title: string;
    description: string;
    iconBackground: string;
    icon: ReactNode;
    onClick: () => void;
}

const QuickAction = memo((props: QuickActionProps) => {
    return (
        <div className="quick-action" onClick={props.onClick}>
            <div className="quick-action-icon" style={{ background: props.iconBackground }}>
                {props.icon}
            </div>
            <div className="quick-action-text">
                <div className="quick-action-title">{props.title}</div>
            </div>
        </div>
    )
});

QuickAction.displayName = 'QuickAction';

type Batch = {
    id: number;
    name: string;
    permissions: Permissions;
}

type Intern = {
    id: number;
    name: string;
}

const QuickActions = (props: { batch: Batch; interns: Intern[] }) => {
    const { 
        feedbackModal, 
        observationModal, 
        openFeedbackModal, 
        closeFeedbackModal, 
        openObservationModal, 
        closeObservationModal 
    } = useModalStore();

    const { permissions: { recordObservation, recordFeedback, programManager } } = props.batch;

    if (!recordObservation && !recordFeedback && !programManager) {
        return <></>
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                </div>
                <div className="card-body">
                    {(recordObservation || programManager) && <QuickAction
                        title="Record Observation"
                        description="Add new observation for intern"
                        iconBackground="#e3f2fd"
                        icon={<ObservationIcon />}
                        onClick={openObservationModal}
                    />}
                    {(recordFeedback || programManager) && <QuickAction
                        title="Provide Feedback"
                        description="Give feedback to intern"
                        iconBackground="#e8f5e8"
                        icon={<FeedbackIcon />}
                        onClick={openFeedbackModal}
                    />}
                </div>
            </div>
            {observationModal && <ObservationModal
                batches={[props.batch]}
                internsByBatch={{ [props.batch.id]: props.interns }}
                onClose={closeObservationModal}
            />}
            {feedbackModal && <FeedbackModal
                batches={[props.batch]}
                internsByBatch={{ [props.batch.id]: props.interns }}
                onClose={closeFeedbackModal}
            />}
        </div>
    )
}

export default QuickActions;