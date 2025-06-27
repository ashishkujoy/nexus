"use client";
import { AlertTriangle, Calendar, Eye, FileText, Users, X } from 'lucide-react';
import { useState } from 'react';

import "./observationModal.css";

const ModalHeader = () => {
    return (
        <div className="modal-header">
            <div className="header-left">
                <div className="icon-box">
                    <FileText className="text-blue-600" />
                </div>
                <div>
                    <h2 className="modal-title">Record Observation</h2>
                    <p className="modal-subtitle">Document intern performance and feedback</p>
                </div>
            </div>
            <button className="modal-close-btn">
                <X className="text-gray-500" />
            </button>
        </div>
    )
}

type BatchSelectorProps = {
    batches: { id: string; name: string; startDate: string }[];
    selectedBatch: string;
    setSelectedBatch: (b: string) => void;
    setSelectedIntern: (i: string) => void;
}

const BatchSelector = (props: BatchSelectorProps) => {
    return (
        <div className="form-group">
            <label className="label">Select Batch *</label>
            <div className="select-container">
                <select
                    value={props.selectedBatch}
                    onChange={(e) => {
                        props.setSelectedBatch(e.target.value);
                        props.setSelectedIntern('');
                    }}
                    className="select"
                >
                    <option value="">Choose a batch...</option>
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
    selectedBatch: string;
    availableInterns: { id: string; name: string }[];
    selectedIntern: string;
    setSelectedIntern: (i: string) => void;
}

const InternSelector = (props: InternSelectorProps) => {
    return (
        <div className="form-group">
            <label className="label">Select Intern *</label>
            <div className="select-container">
                <select
                    value={props.selectedIntern}
                    onChange={(e) => props.setSelectedIntern(e.target.value)}
                    disabled={!props.selectedBatch}
                    className="select"
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

    const markdownToHtml = (markdown: string) => {
        return markdown
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
            .replace(/\n\n/g, '</p><p class="mb-3">')
            .replace(/\n/g, '<br>')
            .replace(/^(.+)$/, '<p class="mb-3">$1</p>');
    };
    return (
        <div className="form-group">
            <div className="form-header">
                <label className="label">Observation Content *</label>
                <button onClick={() => setIsPreview(!isPreview)} className="toggle-preview-btn">
                    <Eye className="icon-sm" />
                    {isPreview ? 'Edit' : 'Preview'}
                </button>
            </div>

            {isPreview ? (
                <div className="preview-box">
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{
                            __html: props.content
                                ? markdownToHtml(props.content)
                                : '<p class="modal-subtitle italic">No content to preview</p>'
                        }}
                    />
                </div>
            ) : (
                <textarea
                    value={props.content}
                    onChange={(e) => props.setContent(e.target.value)}
                    placeholder="Write your observation here... You can use markdown formatting:&#10;&#10;**Bold text**&#10;*Italic text*&#10;`Code snippets`&#10;&#10;Regular paragraphs work too."
                    className="textarea"
                    rows={6}
                />
            )}

            <p className="preview-note">
                Supports markdown formatting. Use **bold**, *italic*, and `code` syntax.
            </p>
        </div>
    )
}

const ModalFooter = () => {
    return (
        <div className="modal-footer">
            <button className="cancel-btn">
                Cancel
            </button>
            <button className="submit-btn">
                Submit Observation
            </button>
        </div>
    )
}

const ObservationModal = () => {
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedIntern, setSelectedIntern] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [watchOut, setWatchOut] = useState(false);
    const [content, setContent] = useState('');

    // Mock data based on the screenshot
    const batches = [
        { id: 'batch-a', name: 'STEP 2024 Batch A', startDate: '15/1/2024' },
        { id: 'batch-b', name: 'STEP 2024 Batch B', startDate: '1/6/2024' }
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internsByBatch: any = {
        'batch-a': [
            { id: 'john-doe', name: 'John Doe' },
            { id: 'jane-smith', name: 'Jane Smith' },
            { id: 'mike-wilson', name: 'Mike Wilson' },
            { id: 'alice-brown', name: 'Alice Brown' }
        ],
        'batch-b': [
            { id: 'intern-1', name: 'Sarah Johnson' },
            { id: 'intern-2', name: 'David Lee' },
            { id: 'intern-3', name: 'Emma Davis' }
        ]
    };

    const availableInterns: { id: string; name: string }[] = selectedBatch ? internsByBatch[selectedBatch] || [] : [];

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <ModalHeader />
                <div className="modal-body">
                    <div className="modal-form">
                        <div className="intern-batch-selectors">
                            <BatchSelector
                                batches={batches}
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
                <ModalFooter />
            </div>
        </div>
    );
};

export default ObservationModal;