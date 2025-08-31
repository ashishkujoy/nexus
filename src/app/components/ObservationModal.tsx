"use client";
import { AlertTriangle, Calendar, Eye, FileText, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import ErrorOverlay from './ErrorOverlay';
import LoaderOverlay from './LoaderOverlay';
import MarkdownRenderer from './MarkdownView';
import "./observationModal.css";
import SuccessOverlay from './SuccessOverlay';

const ModalHeader = (props: { onClose: () => void; }) => {
    return (
        <div className="modal-header">
            <div className="header-left">
                <div className="icon-box">
                    <FileText className="text-blue-600" />
                </div>
                <div>
                    <h2 className="modal-title">Record Observation</h2>
                    <p className="modal-subtitle">Document intern performance and observation</p>
                </div>
            </div>
            <button className="modal-close-btn" onClick={props.onClose}>
                <X className="text-gray-500" />
            </button>
        </div>
    )
}

type BatchSelectorProps = {
    batches: Batch[];
    selectedBatch: number;
    setSelectedBatch: (b: number) => void;
    setSelectedIntern: (i: number) => void;
}

const BatchSelector = (props: BatchSelectorProps) => {
    return (
        <div className="form-group">
            <label className="label">Select Batch *</label>
            <div className="select-container">
                <select
                    value={props.selectedBatch}
                    onChange={(e) => {
                        props.setSelectedBatch(+e.target.value);
                        props.setSelectedIntern(-1);
                    }}
                    className="select"
                    name='batchId'
                    required
                >
                    <option value={-1}>Choose a batch...</option>
                    {props.batches.map(batch => (
                        <option key={batch.id} value={batch.id}>
                            {batch.name}
                        </option>
                    ))}
                </select>
                <Users className="icon-right" />
            </div>
        </div>
    )
}

type InternSelectorProps = {
    selectedBatch: number;
    availableInterns: Intern[];
    selectedIntern: number;
    setSelectedIntern: (i: number) => void;
}

const InternSelector = (props: InternSelectorProps) => {
    return (
        <div className="form-group">
            <label className="label">Select Intern *</label>
            <div className="select-container">
                <select
                    value={props.selectedIntern}
                    onChange={(e) => props.setSelectedIntern(+e.target.value)}
                    disabled={!props.selectedBatch}
                    className="select"
                    required
                    name='internId'
                >
                    <option value="">
                        {props.selectedBatch ? 'Choose an intern...' : 'Select a batch first'}
                    </option>
                    {props.availableInterns.map((intern) => (
                        <option key={intern.id} value={intern.id}>
                            {intern.name}
                        </option>
                    ))}
                </select>
                <Users className="icon-right" />
            </div>
        </div>
    )
}

type ObservationDateSelectorProps = {
    date: string;
    setDate: (d: string) => void;
}

const ObservationDateSelector = (props: ObservationDateSelectorProps) => {
    return (
        <div className="form-group">
            <label className="label">Observation Date *</label>
            <div className="select-container">
                <input
                    type="date"
                    value={props.date}
                    onChange={(e) => props.setDate(e.target.value)}
                    className="date-input"
                />
                <Calendar className="icon-right" />
            </div>
        </div>
    )
}

type WatchOutProps = {
    watchOut: boolean;
    setWatchOut: (w: boolean) => void;
}

const WatchOut = (props: WatchOutProps) => {
    return (
        <div>
            <label className="checkbox-label">
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={props.watchOut}
                        onChange={(e) => props.setWatchOut(e.target.checked)}
                        className="sr-only"
                    />
                    <div className={`checkbox-box ${props.watchOut ? 'checked' : 'unckecked'}`}>
                        {props.watchOut && <AlertTriangle className="text-white" />}
                    </div>
                </div>
                <div style={{ margin: '0' }}>
                    <span className="label">Watch Out</span>
                    <p className="modal-subtitle">Mark this observation as requiring attention</p>
                </div>
            </label>
        </div>
    )
}

type ContentSectionProps = {
    content: string;
    setContent: (c: string) => void;
}

const ContentSection = (props: ContentSectionProps) => {
    const [isPreview, setIsPreview] = useState(false);
    const onPreviewToggle = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsPreview((prev) => !prev);
    }, [setIsPreview]);

    return (
        <div className="form-group">
            <div className="form-header">
                <label className="label">Observation Content *</label>
                <button onClick={onPreviewToggle} className="toggle-preview-btn">
                    <Eye className="icon-sm" />
                    {isPreview ? 'Edit' : 'Preview'}
                </button>
            </div>

            {isPreview ? (
                <div className="preview-box">
                    <MarkdownRenderer content={props.content} />
                </div>
            ) : (
                <textarea
                    value={props.content}
                    onChange={(e) => props.setContent(e.target.value)}
                    placeholder="Write your observation here... You can use markdown formatting:&#10;&#10;**Bold text**&#10;*Italic text*&#10;`Code snippets`&#10;&#10;Regular paragraphs work too."
                    className="textarea"
                    rows={6}
                    name='content'
                    required
                />
            )}
        </div>
    )
}

const ModalFooter = (props: { onClose: () => void; }) => {
    return (
        <div className="modal-footer">
            <button className="cancel-btn" onClick={props.onClose}>
                Cancel
            </button>
            <button className="submit-btn" type="submit">
                Submit Observation
            </button>
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

type ObservationModalProps = {
    batches: Batch[];
    internsByBatch: { [key: number]: Intern[] };
    onClose: () => void;
}

const ObservationModal = (props: ObservationModalProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [selectedBatch, setSelectedBatch] = useState(-1);
    const [selectedIntern, setSelectedIntern] = useState(-1);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [watchOut, setWatchOut] = useState(false);
    const [content, setContent] = useState('');
    
    const observationMutation = useMutation({
        mutationFn: async (reqBody: {
            observations: Array<{
                internId: number;
                date: string;
                watchOut: boolean;
                content: string;
            }>;
        }) => {
            const response = await fetch(`/api/batches/${selectedBatch}/observations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit observation');
            }
            
            return response.json();
        }
    });

    useEffect(() => {
        if (props.batches.length === 1) {
            setSelectedBatch(props.batches[0].id);
        }
    }, [props.batches])

    const availableInterns: Intern[] = selectedBatch ? props.internsByBatch[selectedBatch] || [] : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reqBody = {
            observations: [{
                internId: +selectedIntern,
                date,
                watchOut,
                content
            }]
        };
        
        observationMutation.mutate(reqBody);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <ModalHeader onClose={props.onClose} />
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="modal-form">
                            <div className="intern-batch-selectors">
                                <BatchSelector
                                    batches={props.batches}
                                    selectedBatch={selectedBatch}
                                    setSelectedBatch={setSelectedBatch}
                                    setSelectedIntern={setSelectedIntern}
                                />
                                <InternSelector
                                    selectedBatch={selectedBatch}
                                    availableInterns={availableInterns}
                                    selectedIntern={selectedIntern}
                                    setSelectedIntern={setSelectedIntern}
                                />
                                <ObservationDateSelector
                                    date={date}
                                    setDate={setDate}
                                />
                            </div>
                            <WatchOut
                                watchOut={watchOut}
                                setWatchOut={setWatchOut}
                            />
                            <ContentSection
                                content={content}
                                setContent={setContent}
                            />
                        </div>
                    </div>
                    <ModalFooter onClose={props.onClose} />
                </form>
            </div>
            {observationMutation.isPending && <LoaderOverlay title="Hold On" message="Submitting observation..." />}
            {observationMutation.isSuccess && <SuccessOverlay title="Success" message="Observation recorded successfully!" onClose={() => {
                observationMutation.reset();
                props.onClose();
                queryClient.invalidateQueries({ queryKey: ['observations'] });
                router.refresh(); // Refresh server-side data
            }} />}
            {observationMutation.isError && <ErrorOverlay title="Error" message={observationMutation.error?.message || "Failed to submit observation"} onClose={() => observationMutation.reset()} />}
        </div>
    );
};

export default ObservationModal;