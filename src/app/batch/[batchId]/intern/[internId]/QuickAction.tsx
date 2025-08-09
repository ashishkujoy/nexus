"use client";

import ErrorOverlay from "@/app/components/ErrorOverlay";
import { NoticeIcon, PlusIcon, TerminateIcon } from "@/app/components/Icons";
import LoaderOverlay from "@/app/components/LoaderOverlay";
import { useCallback, useState } from "react";
import { Permissions } from "../../types";
import SuccessOverlay from "@/app/components/SuccessOverlay";

const QuickActions = (props: { permissions: Permissions; batchId: number; internId: number; notice: boolean; terminated: boolean }) => {
    const { recordObservation, recordFeedback, programManager } = props.permissions;
    const [loadingMsg, setLoadingMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

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
                (recordObservation || programManager) && <button className="action-btn btn-primary">
                    <PlusIcon />
                    Record Observation
                </button>

            }
            {
                (recordFeedback || programManager) && <button className="action-btn btn-secondary">
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