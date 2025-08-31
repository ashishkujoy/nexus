"use client";
import { AlertTriangle, Calendar, Eye, FileText, Paintbrush, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import "./observationModal.css";
import LoaderOverlay from './LoaderOverlay';
import SuccessOverlay from './SuccessOverlay';
import ErrorOverlay from './ErrorOverlay';
import MarkdownRenderer from './MarkdownView';

const ModalHeader = (props: { onClose: () => void; }) => {
    return (
        <div className="modal-header">
            <div className="header-left">
                <div className="icon-box">
                    <FileText className="text-blue-600" />
                </div>
                <div>
                    <h2 className="modal-title">Record Feedback</h2>
                    <p className="modal-subtitle">Document intern performance and feedback</p>
                </div>
            </div>
            <button className="modal-close-btn" onClick={props.onClose}>
                <X className="text-gray-500" />
            </button>
        </div>
    )
}


type ColorCodeSelectorProps = {
    selectedColorCode: number;
    setColorCode: (c: number) => void;
}

const ColorCodeSelector = (props: ColorCodeSelectorProps) => {
    const colors = [
        { name: "Green", code: 4 },
        { name: "Yellow", code: 3 },
        { name: "Orange", code: 2 },
        { name: "Red", code: 1 }
    ];

    return (
        <div className="form-group">
            <label className="label">Color Code</label>
            <div className="select-container">
                <select
                    value={props.selectedColorCode}
                    onChange={(e) => props.setColorCode(parseInt(e.target.value))}
                    className="select"
                    name='colorCode'
                    required
                >
                    <option value={-1}>Choose color code...</option>
                    {colors.map(color => (
                        <option key={color.code} value={color.code}>
                            {color.name}
                        </option>
                    ))}
                </select>
                <Paintbrush className="icon-right" />
            </div>
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

const DateSelector = (props: ObservationDateSelectorProps) => {
    return (
        <div className="form-group">
            <label className="label">Date *</label>
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

type NoticeProps = {
    notice: boolean;
    setNotice: (w: boolean) => void;
}

const Notice = (props: NoticeProps) => {
    return (
        <div>
            <label className="checkbox-label">
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={props.notice}
                        onChange={(e) => props.setNotice(e.target.checked)}
                        className="sr-only"
                    />
                    <div className={`checkbox-box ${props.notice ? 'checked' : 'unckecked'}`}>
                        {props.notice && <AlertTriangle className="text-white" />}
                    </div>
                </div>
                <div style={{ margin: '0' }}>
                    <span className="label">Notice</span>
                    <p className="modal-subtitle">Mark this feedback as notice feedback</p>
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
    const togglePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPreview(!isPreview)
    };

    return (
        <div className="form-group">
            <div className="form-header">
                <label className="label">Feedback Content *</label>
                <button onClick={togglePreview} className="toggle-preview-btn">
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

            <p className="preview-note">
                Supports markdown formatting. Use **bold**, *italic*, and `code` syntax.
            </p>
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
                Submit Feedback
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

type FeedbackModalProps = {
    batches: Batch[];
    internsByBatch: { [key: number]: Intern[] };
    onClose: () => void;
}

const codeToColor = (code: number): string | undefined => {
    switch (code) {
        case 4: return 'green';
        case 3: return 'yellow';
        case 2: return 'orange';
        case 1: return 'red';
    }
}

const FeedbackModal = (props: FeedbackModalProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [selectedBatch, setSelectedBatch] = useState(-1);
    const [selectedIntern, setSelectedIntern] = useState(-1);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notice, setNotice] = useState(false);
    const [colorCode, setColorCode] = useState(-1);
    const [content, setContent] = useState('');
    
    const feedbackMutation = useMutation({
        mutationFn: async (reqBody: {
            internId: number;
            date: string;
            notice: boolean;
            content: string;
            colorCode: string | undefined;
        }) => {
            const response = await fetch(`/api/batches/${selectedBatch}/feedbacks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit feedback');
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
            internId: +selectedIntern,
            date,
            notice,
            content,
            colorCode: codeToColor(colorCode),
        };
        
        feedbackMutation.mutate(reqBody);
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
                                <ColorCodeSelector
                                    selectedColorCode={colorCode}
                                    setColorCode={setColorCode}
                                />
                                <DateSelector
                                    date={date}
                                    setDate={setDate}
                                />
                            </div>
                            <Notice
                                notice={notice}
                                setNotice={setNotice}
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
            {feedbackMutation.isPending && <LoaderOverlay title="Hold On" message="Submitting Feedback..." />}
            {feedbackMutation.isSuccess && <SuccessOverlay title="Success" message="Feedback recorded successfully!" onClose={() => {
                feedbackMutation.reset();
                props.onClose();
                queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
                router.refresh(); // Refresh server-side data
            }} />}
            {feedbackMutation.isError && <ErrorOverlay title="Error" message={feedbackMutation.error?.message || "Failed to submit feedback"} onClose={() => feedbackMutation.reset()} />}
        </div>
    );
};

export default FeedbackModal;