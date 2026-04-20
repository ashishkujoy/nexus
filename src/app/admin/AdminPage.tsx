"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BatchWithAssignments, Mentor } from "./action";

type Props = {
    initialMentors: Mentor[];
    initialBatches: BatchWithAssignments[];
};

const fetchMentors = async (): Promise<Mentor[]> => {
    const res = await fetch("/api/mentors");
    if (!res.ok) throw new Error("Failed to fetch mentors");
    return res.json();
};

const fetchBatches = async (): Promise<BatchWithAssignments[]> => {
    const res = await fetch("/api/admin/batches");
    if (!res.ok) throw new Error("Failed to fetch batches");
    return res.json();
};

type EditState = { username: string; email: string; root: boolean };

const MentorItem = ({ mentor }: { mentor: Mentor }) => {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<EditState>({ username: mentor.username, email: mentor.email, root: mentor.root });
    const [error, setError] = useState("");

    const updateMentor = useMutation({
        mutationFn: async (data: EditState) => {
            const res = await fetch(`/api/mentors/${mentor.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update mentor");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentors"] });
            setEditing(false);
            setError("");
        },
        onError: (err: Error) => setError(err.message),
    });

    if (editing) {
        return (
            <li className="mentor-item mentor-item-editing">
                <form
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}
                    onSubmit={e => { e.preventDefault(); updateMentor.mutate(form); }}
                >
                    <div className="form-row">
                        <input
                            className="form-input"
                            placeholder="Full name"
                            value={form.username}
                            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                            required
                        />
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            required
                        />
                    </div>
                    <label className="perm-checkbox" style={{ alignSelf: "flex-start" }}>
                        <input
                            type="checkbox"
                            checked={form.root}
                            onChange={e => setForm(f => ({ ...f, root: e.target.checked }))}
                        />
                        Admin
                    </label>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-actions">
                        <button type="button" className="btn-sm btn-secondary" onClick={() => { setEditing(false); setError(""); setForm({ username: mentor.username, email: mentor.email, root: mentor.root }); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-sm btn-primary" disabled={updateMentor.isPending}>
                            {updateMentor.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className="mentor-item">
            <div className="mentor-avatar">{mentor.username[0].toUpperCase()}</div>
            <div className="mentor-info">
                <div className="mentor-name">{mentor.username}</div>
                <div className="mentor-email">{mentor.email}</div>
            </div>
            {mentor.root && <span className="root-badge">Admin</span>}
            <button className="btn-sm btn-secondary" onClick={() => setEditing(true)} style={{ flexShrink: 0 }}>
                Edit
            </button>
        </li>
    );
};

const MentorsSection = () => {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");

    const { data: mentors = [] } = useQuery<Mentor[]>({
        queryKey: ["mentors"],
        queryFn: fetchMentors,
    });

    const addMentor = useMutation({
        mutationFn: async (data: { username: string; email: string }) => {
            const res = await fetch("/api/mentors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to add mentor");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentors"] });
            setName("");
            setEmail("");
            setShowForm(false);
            setFormError("");
        },
        onError: (err: Error) => {
            setFormError(err.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        addMentor.mutate({ username: name, email });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <span className="admin-section-title">Mentors</span>
                {!showForm && (
                    <button className="btn-sm btn-primary" onClick={() => setShowForm(true)}>
                        + Add Mentor
                    </button>
                )}
            </div>

            <ul className="mentor-list">
                {mentors.map(mentor => (
                    <MentorItem key={mentor.id} mentor={mentor} />
                ))}
                {mentors.length === 0 && (
                    <li className="mentor-item" style={{ color: "#9ca3af", fontSize: "13px" }}>
                        No mentors yet
                    </li>
                )}
            </ul>

            <form className={`add-mentor-form${showForm ? "" : " hidden"}`} onSubmit={handleSubmit}>
                <div className="form-row">
                    <input
                        className="form-input"
                        placeholder="Full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input
                        className="form-input"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                {formError && <div className="error-message">{formError}</div>}
                <div className="form-actions">
                    <button type="button" className="btn-sm btn-secondary" onClick={() => { setShowForm(false); setName(""); setEmail(""); setFormError(""); }}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-sm btn-primary" disabled={addMentor.isPending}>
                        {addMentor.isPending ? "Adding..." : "Add Mentor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

type AssignFormState = {
    mentorId: number;
    recordObservation: boolean;
    recordFeedback: boolean;
    programManager: boolean;
};

const BatchAssignmentItem = ({ batch, mentors }: { batch: BatchWithAssignments; mentors: Mentor[] }) => {
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [assignForm, setAssignForm] = useState<AssignFormState>({
        mentorId: 0,
        recordObservation: false,
        recordFeedback: false,
        programManager: false,
    });
    const [assignError, setAssignError] = useState("");

    const assignMentor = useMutation({
        mutationFn: async (data: { mentorId: number; permissions: { recordObservation: boolean; recordFeedback: boolean; programManager: boolean } }) => {
            const res = await fetch(`/api/batches/${batch.id}/mentors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to assign mentor");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batches-with-assignments"] });
            setShowAssignForm(false);
            setAssignForm({ mentorId: 0, recordObservation: false, recordFeedback: false, programManager: false });
            setAssignError("");
        },
        onError: (err: Error) => setAssignError(err.message),
    });

    const unassignMentor = useMutation({
        mutationFn: async (mentorId: number) => {
            const res = await fetch(`/api/batches/${batch.id}/mentors/${mentorId}`, { method: "DELETE" });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to unassign mentor");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batches-with-assignments"] });
        },
    });

    const assignedMentorIds = new Set(batch.assignments.map(a => a.mentorId));
    const unassignedMentors = mentors.filter(m => !assignedMentorIds.has(m.id) && !m.root);

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignForm.mentorId) {
            setAssignError("Please select a mentor");
            return;
        }
        setAssignError("");
        assignMentor.mutate({
            mentorId: assignForm.mentorId,
            permissions: {
                recordObservation: assignForm.recordObservation,
                recordFeedback: assignForm.recordFeedback,
                programManager: assignForm.programManager,
            },
        });
    };

    return (
        <li className="batch-assignment-item">
            <div className="batch-assignment-header" onClick={() => setExpanded(v => !v)}>
                <div className="batch-assignment-name">{batch.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="batch-assignment-count">
                        {batch.assignments.length} mentor{batch.assignments.length !== 1 ? "s" : ""}
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>{expanded ? "▲" : "▼"}</span>
                </div>
            </div>

            {expanded && (
                <div className="batch-assignment-body">
                    {batch.assignments.length === 0 ? (
                        <div className="empty-assignments">No mentors assigned yet.</div>
                    ) : (
                        <ul className="assigned-mentors">
                            {batch.assignments.map(a => (
                                <li key={a.id} className="assigned-mentor-row">
                                    <span className="assigned-mentor-name">{a.mentorName}</span>
                                    <div className="permission-chips">
                                        {a.permissions.recordObservation && <span className="perm-chip observe">Observe</span>}
                                        {a.permissions.recordFeedback && <span className="perm-chip feedback">Feedback</span>}
                                        {a.permissions.programManager && <span className="perm-chip pm">PM</span>}
                                    </div>
                                    <button
                                        className="btn-unassign"
                                        onClick={() => unassignMentor.mutate(a.mentorId)}
                                        disabled={unassignMentor.isPending}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {unassignedMentors.length > 0 && (
                        <button
                            className="btn-sm btn-secondary"
                            onClick={() => { setShowAssignForm(v => !v); setAssignError(""); }}
                        >
                            {showAssignForm ? "Cancel" : "+ Assign Mentor"}
                        </button>
                    )}

                    <form className={`assign-form${showAssignForm ? "" : " hidden"}`} onSubmit={handleAssign}>
                        <select
                            className="assign-select"
                            value={assignForm.mentorId}
                            onChange={e => setAssignForm(f => ({ ...f, mentorId: Number(e.target.value) }))}
                        >
                            <option value={0}>Select a mentor</option>
                            {unassignedMentors.map(m => (
                                <option key={m.id} value={m.id}>{m.username} ({m.email})</option>
                            ))}
                        </select>
                        <div className="permissions-row">
                            <label className="perm-checkbox">
                                <input
                                    type="checkbox"
                                    checked={assignForm.recordObservation}
                                    onChange={e => setAssignForm(f => ({ ...f, recordObservation: e.target.checked }))}
                                />
                                Observations
                            </label>
                            <label className="perm-checkbox">
                                <input
                                    type="checkbox"
                                    checked={assignForm.recordFeedback}
                                    onChange={e => setAssignForm(f => ({ ...f, recordFeedback: e.target.checked }))}
                                />
                                Feedback
                            </label>
                            <label className="perm-checkbox">
                                <input
                                    type="checkbox"
                                    checked={assignForm.programManager}
                                    onChange={e => setAssignForm(f => ({ ...f, programManager: e.target.checked }))}
                                />
                                Program Manager
                            </label>
                        </div>
                        {assignError && <div className="error-message">{assignError}</div>}
                        <div className="form-actions">
                            <button type="submit" className="btn-sm btn-primary" disabled={assignMentor.isPending}>
                                {assignMentor.isPending ? "Assigning..." : "Assign"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </li>
    );
};

const BatchAssignmentsSection = ({ initialBatches, mentors }: { initialBatches: BatchWithAssignments[]; mentors: Mentor[] }) => {
    const { data: batches = initialBatches } = useQuery<BatchWithAssignments[]>({
        queryKey: ["batches-with-assignments"],
        queryFn: fetchBatches,
        initialData: initialBatches,
    });

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <span className="admin-section-title">Batch Assignments</span>
            </div>
            <ul className="batch-assignment-list">
                {batches.map(batch => (
                    <BatchAssignmentItem key={batch.id} batch={batch} mentors={mentors} />
                ))}
                {batches.length === 0 && (
                    <li style={{ padding: "24px", color: "#9ca3af", fontSize: "13px" }}>No batches found.</li>
                )}
            </ul>
        </div>
    );
};

const AdminPage = ({ initialMentors, initialBatches }: Props) => {
    const { data: mentors = initialMentors } = useQuery<Mentor[]>({
        queryKey: ["mentors"],
        queryFn: fetchMentors,
        initialData: initialMentors,
    });

    return (
        <div className="admin-grid">
            <MentorsSection />
            <BatchAssignmentsSection initialBatches={initialBatches} mentors={mentors} />
        </div>
    );
};

export default AdminPage;
