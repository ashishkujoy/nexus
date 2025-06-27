"use client";

import { useState } from "react";
import BatchModal from "./components/BatchModal";

type Batch = {
    id: number;
    name: string;
    startDate: string;
    root: boolean;
    permissions: string[];
}

const getPermissionBadges = (permissions: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const badgeMap: any = {
        recordObservation: { text: 'Observe', color: 'badge-blue' },
        recordFeedback: { text: 'Feedback', color: 'badge-green' },
        deliverFeedback: { text: 'Deliver', color: 'badge-purple' },
        programManager: { text: 'PM', color: 'badge-red' }
    };

    return permissions.map(perm => badgeMap[perm]).filter(Boolean);
};

const BatchCard = (props: { batch: Batch }) => {
    const { batch } = props;
    return (
        <div className="batch-card">
            <div className="batch-header">
                <div className="batch-info">
                    <h4>{batch.name}</h4>
                    <p>Started: {new Date(batch.startDate).toLocaleDateString()}</p>
                </div>
                {batch.root && (
                    <span className="admin-badge">
                        Admin
                    </span>
                )}
            </div>

            <div className="permission-badges">
                {getPermissionBadges(batch.permissions).map((badge, index) => (
                    <span key={index} className={`badge ${badge.color}`}>
                        {badge.text}
                    </span>
                ))}
            </div>
        </div>
    )
}

const Batchs = (props: { batchs: Batch[]; onNewBatch: () => void; allowBatchCreation: boolean }) => {
    const { batchs } = props;

    return (
        <div className="section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="section-title">My Batches</h3>
                {props.allowBatchCreation && <button className="btn btn-primary" onClick={props.onNewBatch}>+ Add Batch</button>}
            </div>

            <div className="batch-grid">
                {batchs.map((batch) => <BatchCard key={batch.id} batch={batch} />)}
            </div>
        </div>
    )
}

const EmptyBatch = (props: { onNewBatch: () => void; allowBatchCreation: boolean }) => {
    return (
        <div>
            <div className="section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="section-title">My Batches</div>
                    {props.allowBatchCreation && <button className="btn btn-primary" onClick={props.onNewBatch}>+ Add Batch</button>}
                </div>
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">No batches yet</div>
                    <div className="empty-description">
                        Ask admin to add you to a batch.
                    </div>
                </div>
            </div>
        </div>
    )
}

type BatchSectionProps = {
    batchs: Batch[];
    allowBatchCreation: boolean;
}

const BatchSection = (props: BatchSectionProps) => {
    const { batchs } = props;
    const [batchModal, setBatchModal] = useState(false);
    const toggleBatchModal = () => setBatchModal(!batchModal);

    return (
        <div className="batch-section">
            {batchs.length > 0 ? <Batchs batchs={batchs} onNewBatch={toggleBatchModal} allowBatchCreation={props.allowBatchCreation} /> : <EmptyBatch onNewBatch={toggleBatchModal} allowBatchCreation={props.allowBatchCreation} />}
            {batchModal && <BatchModal onClose={toggleBatchModal} />}
        </div>
    );
}

export default BatchSection;