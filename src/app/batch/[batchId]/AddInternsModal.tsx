import ErrorOverlay from "@/app/components/ErrorOverlay";
import LoaderOverlay from "@/app/components/LoaderOverlay";
import SuccessOverlay from "@/app/components/SuccessOverlay";
import { FormEvent, useState } from "react";

import "./modal.css";

type Props = {
    onClose: () => void;
    onInternsAdded: () => void;
    batchId: number;
}

const parseInternsCSV = (content: string) => {
    return content.trim().split("\n").map(line => {
        const [name, email] = line.split(",");
        return {
            name: name.replaceAll("\"", "").trim(),
            email: email.replaceAll("\"", "").trim(),
        };
    });
}

const AddInternsModal = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>("");

    const onSuccess = () => {
        setSuccess(false);
        props.onInternsAdded();
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const content = await (formData.get("file") as File).text();
        setLoading(true);
        try {
            const res = await fetch("/api/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "OnboardInterns",
                    batchId: props.batchId,
                    interns: parseInternsCSV(content),
                }),
            });
            setLoading(false);
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.error || "Failed to onboard interns");
                return;
            }
            setSuccess(true);
        } catch {
            setLoading(false);
            setError("An unexpected error occurred");
        }
    }

    return (
        <div className="modal active">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Upload Interns Details</h2>
                    <button className="close-modal" onClick={props.onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Upload CSV File</label>
                        <input type="file" accept=".csv" name="file" required />
                        <div className="help-text">Choose a csv file of format: name,email</div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", textAlign: "right", marginTop: "20px", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-secondary" onClick={props.onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Onboard</button>
                    </div>
                </form>
            </div>
            {loading && <LoaderOverlay title="Hold On" message="Onboarding Interns" />}
            {success && <SuccessOverlay title={"Successfully onboarded Interns"} message={""} onClose={onSuccess} />}
            {error && <ErrorOverlay title={"Failed to update Interns"} message={error} onClose={() => setError("")} />}
        </div>

    )
}

export default AddInternsModal;