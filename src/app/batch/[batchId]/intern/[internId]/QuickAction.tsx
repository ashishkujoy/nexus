"use client";

import ErrorOverlay from "@/app/components/ErrorOverlay";
import { NoticeIcon, PlusIcon, TerminateIcon } from "@/app/components/Icons";
import LoaderOverlay from "@/app/components/LoaderOverlay";
import { Skeleton } from "@/app/components/Skeleton";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Permissions } from "../../types";
import SuccessOverlay from "@/app/components/SuccessOverlay";

const ObservationModal = dynamic(() => import("@/app/components/ObservationModal"), {
    loading: () => <Skeleton width="600px" height="400px" />,
    ssr: false
});

const FeedbackModal = dynamic(() => import("@/app/components/FeedbackModal"), {
    loading: () => <Skeleton width="600px" height="400px" />,
    ssr: false
});

const QuickActions = (props: { permissions: Permissions; batchId: number; batchName: string; internId: number; internName: string; notice: boolean; terminated: boolean }) => {
    const { recordObservation, recordFeedback, programManager } = props.permissions;
    const [loadingMsg, setLoadingMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [observationModalOpen, setObservationModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const terminateIntern = useCallback(() => {
        setLoadingMsg("Terminating intern...");
        fetch(`/api/batches/${props.batchId}/interns/${props.internId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json().then(body => ({ ok: res.ok, body })))
            .then(({ ok, body }) => {
                if (ok) {
                    setSuccessMsg("Intern terminated successfully.");
                    return;
                }
                setErrorMsg(body.error || "Failed to terminate intern.");
            })
            .catch(err => setErrorMsg(`An error occurred while terminating the intern. ${err.message}`))
            .finally(() => setLoadingMsg(""));
    }, [props.batchId, props.internId])

    const clearError = useCallback(() => setErrorMsg(""), []);
    const clearSuccess = useCallback(() => setSuccessMsg(""), []);

    return (
        <div className="quick-actions">
            {
                (recordObservation || programManager) && <button className="action-btn btn-primary" onClick={() => setObservationModalOpen(true)}>
                    <PlusIcon />
                    Record Observation
                </button>

            }
            {
                (recordFeedback || programManager) && <button className="action-btn btn-secondary" onClick={() => setFeedbackModalOpen(true)}>
                    <PlusIcon />
                    Record Feedback
                </button>
            }
            {
                programManager && <button className="action-btn btn-warning">
                    <NoticeIcon width={16} heigth={16} />
                    Mark Notice
                </button>
            }
            {
                programManager && <button className={`action-btn btn-danger ${props.terminated ? "disabled" : ""}`} onClick={terminateIntern}>
                    <TerminateIcon />
                    Terminate
                </button>
            }
            {
                feedbackModalOpen && <FeedbackModal
                    batches={[{ id: props.batchId, name: props.batchName }]}
                    internsByBatch={{ [props.batchId]: [{ id: props.internId, name: props.internName }] }}
                    onClose={() => setFeedbackModalOpen(false)}
                />
            }
            {
                observationModalOpen && <ObservationModal
                    batches={[{ id: props.batchId, name: props.batchName }]}
                    internsByBatch={{ [props.batchId]: [{ id: props.internId, name: props.internName }] }}
                    onClose={() => setObservationModalOpen(false)}
                />
            }
            {
                loadingMsg && <LoaderOverlay title="Hold On!" message={loadingMsg} />
            }
            {
                errorMsg && <ErrorOverlay title="Error!" message={errorMsg} onClose={clearError} />
            }
            {
                successMsg && <SuccessOverlay title="Success!" message={successMsg} onClose={clearSuccess} />
            }
        </div>
    )
}

export default QuickActions;
