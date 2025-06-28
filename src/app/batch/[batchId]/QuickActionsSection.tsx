"use client";
import FeedbackModal from "@/app/components/FeedbackModal";
import { FeedbackIcon, ObservationIcon } from "@/app/components/Icons";
import ObservationModal from "@/app/components/ObservationModal";
import { ReactNode, useState } from "react";

type QuickActionProps = {
    title: string;
    description: string;
    iconBackground: string;
    icon: ReactNode;
    onClick: () => void;
}

const QuickAction = (props: QuickActionProps) => {
    return (
        <div className="quick-action" onClick={props.onClick}>
            <div className="quick-action-icon" style={{ background: props.iconBackground }}>
                {props.icon}
            </div>
            <div className="quick-action-text">
                <div className="quick-action-title">{props.title}</div>
                <div className="quick-action-desc">{props.description}</div>
            </div>
        </div>
    )
}

type Batch = {
    id: number;
    name: string;
}

type Intern = {
    id: number;
    name: string;
}

const QuickActions = (props: { batch: Batch; interns: Intern[] }) => {
    const [showObservationModal, setShowObservationModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const toggleObservationModal = () => setShowObservationModal(!showObservationModal);
    const toggleFeedbackModal = () => setShowFeedbackModal(!showFeedbackModal);

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                </div>
                <div className="card-body">
                    <QuickAction
                        title="Record Observation"
                        description="Add new observation for intern"
                        iconBackground="#e3f2fd"
                        icon={<ObservationIcon />}
                        onClick={toggleObservationModal}
                    />
                    <QuickAction
                        title="Provide Feedback"
                        description="Give feedback to intern"
                        iconBackground="#e8f5e8"
                        icon={<FeedbackIcon />}
                        onClick={toggleFeedbackModal}
                    />
                </div>
            </div>
            {showObservationModal && <ObservationModal
                batches={[props.batch]}
                internsByBatch={{ [props.batch.id]: props.interns }}
                onClose={toggleObservationModal}
            />}
            {showFeedbackModal && <FeedbackModal
                batches={[props.batch]}
                internsByBatch={{ [props.batch.id]: props.interns }}
                onClose={toggleFeedbackModal}
            />}
        </div>
    )
}

export default QuickActions;