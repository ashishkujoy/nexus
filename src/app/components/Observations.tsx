"use client";
import { BinocularsIcon, ChevronDownIcon, ChevronUpIcon, Eye } from "lucide-react";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Observation } from "../batch/[batchId]/types";
import { formatDate } from "../date";

import "./observations.css";
import MarkdownRenderer from "./MarkdownView";

type EditObservationModalProps = {
    observation: Observation;
    onClose: () => void;
    onSaved: () => void;
}

const EditObservationModal = (props: EditObservationModalProps) => {
    const [content, setContent] = useState(props.observation.content);
    const [watchout, setWatchout] = useState(props.observation.watchout);
    const [isPreview, setIsPreview] = useState(false);

    const editMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/observations/${props.observation.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, watchout }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to update observation");
            }
            return response.json();
        },
        onSuccess: () => { props.onSaved(); },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editMutation.isPending) editMutation.mutate();
    };

    return (
        <div style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: "#fff", borderRadius: "8px", padding: "24px",
                width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Edit Observation</h3>
                    <button onClick={props.onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input type="checkbox" checked={watchout} onChange={(e) => setWatchout(e.target.checked)} />
                            <BinocularsIcon size={14} color="orange" />
                            Watch Out
                        </label>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <label style={{ fontWeight: 500 }}>Content</label>
                            <button
                                type="button"
                                onClick={() => setIsPreview(!isPreview)}
                                className="view-more-btn"
                            >
                                <Eye size={14} />
                                {isPreview ? "Edit" : "Preview"}
                            </button>
                        </div>
                        {isPreview ? (
                            <div style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px", minHeight: "120px" }}>
                                <MarkdownRenderer content={content} />
                            </div>
                        ) : (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={8}
                                style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", resize: "vertical", boxSizing: "border-box" }}
                            />
                        )}
                    </div>
                    {editMutation.isError && (
                        <p style={{ color: "red", marginBottom: "8px" }}>{editMutation.error?.message}</p>
                    )}
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button type="button" onClick={props.onClose} className="view-more-btn">Cancel</button>
                        <button type="submit" disabled={editMutation.isPending} className="view-more-btn" style={{ backgroundColor: "#3b82f6", color: "#fff" }}>
                            {editMutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ObservationItem = (props: { observation: Observation; currentUserId: number }) => {
    const [viewMore, setViewMore] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { observation: { internName, mentorName, date, content, watchout } } = props;
    const toggleViewMore = () => setViewMore(!viewMore);
    const queryClient = useQueryClient();
    const router = useRouter();

    const isAuthor = props.observation.mentorId === props.currentUserId;

    return (
        <div className="observation-item">
            <div className="observation-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="observation-intern" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span>{internName}</span>
                    {watchout && <BinocularsIcon color="orange" size={18} />}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className="observation-type">{mentorName}</span>
                    <span className="observation-date">{formatDate(date)}</span>
                </div>
            </div>
            <div className={`observation-text ${!viewMore && "view-less"}`}>
                <MarkdownRenderer content={content} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                {isAuthor && (
                    <button onClick={() => setIsEditing(true)} className="view-more-btn">
                        Edit
                    </button>
                )}
                <button onClick={toggleViewMore} className="view-more-btn">
                    {viewMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <span>{viewMore ? "View Less" : "View More"}</span>
                </button>
            </div>
            {isEditing && (
                <EditObservationModal
                    observation={props.observation}
                    onClose={() => setIsEditing(false)}
                    onSaved={() => {
                        setIsEditing(false);
                        queryClient.invalidateQueries({ queryKey: ['observations'] });
                        router.refresh();
                    }}
                />
            )}
        </div>
    )
}

const Observations = (props: { observations: Observation[]; currentUserId: number }) => {
    return (
        <div className="observations-list">
            {
                props.observations.map(observation => <ObservationItem
                    key={observation.id}
                    observation={observation}
                    currentUserId={props.currentUserId}
                />)
            }
        </div>
    )
}

export default Observations;
