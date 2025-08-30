import { Calendar, FileText, X } from "lucide-react";
import "./observationModal.css";
import { FormEvent } from "react";
import LoaderOverlay from "./LoaderOverlay";
import SuccessOverlay from "./SuccessOverlay";
import ErrorOverlay from "./ErrorOverlay";
import { useMutation } from "@tanstack/react-query";

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

const ModalFooter = (props: {onClose: () => void;}) => {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button className="cancel-btn" onClick={props.onClose}>
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
    const createBatchMutation = useMutation({
        mutationFn: async (batchData: {
            name: string;
            startDate: string;
            endDate?: string;
        }) => {
            const response = await fetch("/api/batches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: batchData.name,
                    startDate: batchData.startDate,
                    endDate: batchData.endDate || undefined,
                }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create batch. Please try again.");
            }
            
            return response.json();
        }
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const req = Object.fromEntries(formData.entries());
        
        createBatchMutation.mutate({
            name: req.name as string,
            startDate: req.startDate as string,
            endDate: req.endDate as string || undefined,
        });
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
                                <ModalFooter onClose={props.onClose}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {createBatchMutation.isPending && <LoaderOverlay title="Hold On" message="Creating batch..." />}
            {createBatchMutation.isSuccess && <SuccessOverlay title="Success" message="Batch created successfully!" onClose={() => {
                createBatchMutation.reset();
                window.location.reload();
                props.onClose();
            }} />}
            {createBatchMutation.isError && <ErrorOverlay title="Error" message={createBatchMutation.error?.message || "Failed to create batch. Please try again."} onClose={() => createBatchMutation.reset()} />}
        </div>
    )
}

export default BatchModal;