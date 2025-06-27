import { Calendar, FileText, X } from "lucide-react";
import "./observationModal.css";
import { FormEvent, useState } from "react";
import LoaderOverlay from "./LoaderOverlay";
import SuccessOverlay from "./SuccessOverlay";
import ErrorOverlay from "./ErrorOverlay";

const ModalHeader = (props: { onClose: () => void; }) => {
    return (
        <div className="modal-header">
            <div className="header-left">
                <div className="icon-box">
                    <FileText className="text-blue-600" />
                </div>
                <div>
                    <h2 className="modal-title">Create Batch</h2>
                </div>
            </div>
            <button className="modal-close-btn" onClick={props.onClose}>
                <X className="text-gray-500" />
            </button>
        </div>
    )
}

const DateSelector = (props: { title: string; name: string; required: boolean }) => {
    return (
        <div className="form-group">
            <label className="label">{props.title} {props.required && "*"}</label>
            <div className="select-container">
                <input
                    type="date"
                    className="date-input"
                    name={props.name}
                    required={props.required}
                />
                <Calendar className="icon-right" />
            </div>
        </div>
    )
}

const ModalFooter = () => {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button className="cancel-btn">
                Cancel
            </button>
            <button className="submit-btn" type="submit">
                Submit
            </button>
        </div>
    )
}

type BatchModalProps = {
    onClose: () => void;
}

const BatchModal = (props: BatchModalProps) => {
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const req = Object.fromEntries(formData.entries());
        setLoadingMsg(`Creating batch ${req.batchName}...`);
        fetch("/api/batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "CreateBatch",
                name: req.name,
                startDate: req.startDate,
                endDate: req.endDate || null,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json();
                    setErrorMsg(`Failed to create batch ${req.batchName}. ${error.error || "Please try again."}`);
                    return;
                }
                setSuccessMsg(`Batch ${req.batchName} created successfully!`);
            })
            .catch(() => setErrorMsg(`Failed to create batch ${req.batchName}. Please try again.`))
            .finally(() => setLoadingMsg(""));
    }

    return (
        <div>
            <div className="modal-overlay">
                <div className="modal-container">
                    <ModalHeader onClose={props.onClose} />
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="modal-form">
                                <div className="form-group">
                                    <label className="label" htmlFor="name">Batch Name *</label>
                                    <div>
                                        <input id="name" type="text" className="input" placeholder="Enter batch name" required name="name" autoFocus />
                                    </div>
                                </div>
                                <DateSelector title="Start Date" name="startDate" required={true} />
                                <DateSelector title="End Date" name="endDate" required={false} />
                                <ModalFooter />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {loadingMsg && <LoaderOverlay title="Hold On" message={loadingMsg} />}
            {successMsg && <SuccessOverlay title="Success" message={successMsg} onClose={() => {
                setSuccessMsg("");
                window.location.reload();
                props.onClose();
            }} />}
            {errorMsg && <ErrorOverlay title="Error" message={errorMsg} onClose={() => setErrorMsg("")} />}
        </div>
    )
}

export default BatchModal;