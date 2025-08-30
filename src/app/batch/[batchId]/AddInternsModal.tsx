import ErrorOverlay from "@/app/components/ErrorOverlay";
import LoaderOverlay from "@/app/components/LoaderOverlay";
import SuccessOverlay from "@/app/components/SuccessOverlay";
import { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import "./modal.css";

type Props = {
    onClose: () => void;
    onInternsAdded: () => void;
    batchId: number;
}

const parseInternsCSV = (content: string) => {
    return content.trim().split("\n").map(line => {
        const [name, email, img_url] = line.split(",");
        return {
            name: name.replaceAll("\"", "").trim(),
            email: email.replaceAll("\"", "").trim(),
            img_url: (img_url || "").replaceAll("\"", "").trim(),
        };
    });
}

const AddInternsModal = (props: Props) => {
    const addInternsMutation = useMutation({
        mutationFn: async (content: string) => {
            const response = await fetch(`/api/batches/${props.batchId}/interns`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    interns: parseInternsCSV(content),
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to onboard interns");
            }
            
            return response.json();
        },
        onSuccess: () => {
            props.onInternsAdded();
        }
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const content = await (formData.get("file") as File).text();
        
        addInternsMutation.mutate(content);
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
                        <div className="help-text">Choose a csv file of format: name,email,img_url</div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", textAlign: "right", marginTop: "20px", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-secondary" onClick={props.onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Onboard</button>
                    </div>
                </form>
            </div>
            {addInternsMutation.isPending && <LoaderOverlay title="Hold On" message="Onboarding Interns" />}
            {addInternsMutation.isSuccess && <SuccessOverlay title={"Successfully onboarded Interns"} message={""} onClose={() => addInternsMutation.reset()} />}
            {addInternsMutation.isError && <ErrorOverlay title={"Failed to update Interns"} message={addInternsMutation.error?.message || "An unexpected error occurred"} onClose={() => addInternsMutation.reset()} />}
        </div>

    )
}

export default AddInternsModal;